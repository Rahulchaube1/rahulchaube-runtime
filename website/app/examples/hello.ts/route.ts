import { helloExample } from "@/lib/hello-example";

export const dynamic = "force-static";

export function GET() {
  return new Response(helloExample.source + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hello.ts"',
    },
  });
}
