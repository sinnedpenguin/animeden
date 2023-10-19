import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IndexPage() {
  
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          No ads. Just anime.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          AnimeDen provides a wide range of ad-free anime content, all accessible to you for free. Watch anime seamlessly!
        </p>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Link href="/home">
          <Button>Start watching now</Button>
        </Link>
      </div>
    </section>
  )
}