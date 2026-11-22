package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// The bootstrap verifies the archive before invoking this private command from
// a temporary executable. Only release-owned paths move; project caches survive.
func activate(stage, dest string) error {
	bin := "bin/rc"
	if runtime.GOOS == "windows" {
		bin += ".exe"
	}
	paths := []string{bin, "LICENSE.md", "licenses"}
	for _, name := range paths {
		if _, err := os.Stat(filepath.Join(stage, name)); err != nil {
			return err
		}
	}
	lock := filepath.Join(dest, ".install-lock")
	if err := os.Mkdir(lock, 0700); err != nil {
		return fmt.Errorf("acquiring install lock: %w", err)
	}
	defer os.Remove(lock)
	backups, err := os.MkdirTemp(dest, ".backup-")
	if err != nil {
		return err
	}
	type move struct{ to, backup string }
	var moved []move
	for i, name := range paths {
		to := filepath.Join(dest, name)
		if err = os.MkdirAll(filepath.Dir(to), 0755); err != nil {
			break
		}
		m := move{to: to}
		if _, statErr := os.Lstat(to); statErr == nil {
			m.backup = filepath.Join(backups, fmt.Sprint(i))
			if err = os.Rename(to, m.backup); err != nil {
				break
			}
		} else if !errors.Is(statErr, os.ErrNotExist) {
			err = statErr
			break
		}
		moved = append(moved, m)
		if err = os.Rename(filepath.Join(stage, name), to); err != nil {
			break
		}
	}
	if err != nil {
		for i := len(moved) - 1; i >= 0; i-- {
			m := moved[i]
			restoreErr := os.RemoveAll(m.to)
			if restoreErr == nil && m.backup != "" {
				restoreErr = os.Rename(m.backup, m.to)
			}
			if restoreErr != nil {
				return fmt.Errorf("%w; restore from %s: %v", err, backups, restoreErr)
			}
		}
	}
	if cleanup := os.RemoveAll(backups); cleanup != nil {
		return errors.Join(err, cleanup)
	}
	return err
}
