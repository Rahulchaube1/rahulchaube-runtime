package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"time"
)

// Each dependency is a bundled ES module. Its digest is both its lock and its
// cache key, so compatible projects can share downloads without a registry.
type dependency struct {
	URL    string `json:"url"`
	SHA256 string `json:"sha256"`
}
type project struct {
	Dependencies map[string]dependency `json:"dependencies"`
}

var moduleName = regexp.MustCompile(`^(@[a-z0-9][a-z0-9._-]*/)?[a-z0-9][a-z0-9._-]*$`)
var digestPattern = regexp.MustCompile(`^[0-9a-f]{64}$`)

func findConfig(dir string) (string, *project, error) {
	for {
		path := filepath.Join(dir, "rc.json")
		data, err := os.ReadFile(path)
		if err == nil {
			var config project
			if err := json.Unmarshal(data, &config); err != nil {
				return "", nil, fmt.Errorf("%s: %w", path, err)
			}
			for name, dep := range config.Dependencies {
				u, err := url.Parse(dep.URL)
				if !moduleName.MatchString(name) || !digestPattern.MatchString(dep.SHA256) || err != nil || u.Scheme != "https" || u.Host == "" || u.User != nil {
					return "", nil, fmt.Errorf("invalid dependency %q in %s (expected a module name, an HTTPS URL and a lowercase SHA-256 digest)", name, path)
				}
			}
			return dir, &config, nil
		}
		if !errors.Is(err, os.ErrNotExist) {
			return "", nil, err
		}
		parent := filepath.Dir(dir)
		if dir == parent {
			return "", nil, nil
		}
		dir = parent
	}
}

func modulePath(dir, digest string) string {
	return filepath.Join(dir, ".rc", "modules", digest+".mjs")
}

const maxModuleBytes = 16 << 20

func matches(data []byte, digest string) bool {
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:]) == digest
}

// Rename only a complete file. Concurrent installers publish identical bytes
// for this digest. An interrupted transfer never replaces a verified module.
func publishModule(path string, data []byte) error {
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	tmp, err := os.CreateTemp(dir, ".install-*")
	if err != nil {
		return err
	}
	defer os.Remove(tmp.Name())
	_, writeErr := tmp.Write(data)
	closeErr := tmp.Close()
	if writeErr != nil {
		return writeErr
	}
	if closeErr != nil {
		return closeErr
	}
	return os.Rename(tmp.Name(), path)
}

func fetchModule(client *http.Client, dep dependency, cache, dest string, offline bool) error {
	if data, err := os.ReadFile(dest); err == nil && matches(data, dep.SHA256) {
		return nil
	}
	data, err := os.ReadFile(cache)
	if err != nil || !matches(data, dep.SHA256) {
		if offline {
			return errors.New("verified module missing from the offline cache")
		}
		res, err := client.Get(dep.URL)
		if err != nil {
			return err
		}
		defer res.Body.Close()
		if res.StatusCode != http.StatusOK {
			return fmt.Errorf("download returned %s", res.Status)
		}
		data, err = io.ReadAll(io.LimitReader(res.Body, maxModuleBytes+1))
		if err != nil {
			return err
		}
		if len(data) > maxModuleBytes {
			return errors.New("module exceeds 16 MiB")
		}
		if !matches(data, dep.SHA256) {
			return errors.New("SHA-256 mismatch")
		}
		if err := publishModule(cache, data); err != nil {
			return err
		}
	}
	return publishModule(dest, data)
}

func installModules(offline bool) error {
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}
	dir, config, err := findConfig(cwd)
	if err != nil {
		return err
	}
	if config == nil {
		return errors.New("rc.json not found (create a project with rc init)")
	}
	cache, err := os.UserCacheDir()
	if err != nil {
		return err
	}
	client := &http.Client{Timeout: 30 * time.Second, CheckRedirect: func(req *http.Request, via []*http.Request) error {
		if req.URL.Scheme != "https" || len(via) >= 10 {
			return errors.New("invalid module download redirect")
		}
		return nil
	}}
	names := make([]string, 0, len(config.Dependencies))
	for name := range config.Dependencies {
		names = append(names, name)
	}
	sort.Strings(names)
	for _, name := range names {
		dep := config.Dependencies[name]
		if err := fetchModule(client, dep, filepath.Join(cache, "rc-runtime", dep.SHA256+".mjs"), modulePath(dir, dep.SHA256), offline); err != nil {
			return fmt.Errorf("%s: %w", name, err)
		}
	}
	fmt.Printf("Verified %d modules\n", len(names))
	return nil
}
