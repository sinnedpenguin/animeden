export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <span className="block text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <a
            target="_blank"
            href="https://sinnedpenguin.me/"
            className="hover:underline" rel="noreferrer"
          >
            sinnedpenguin
          </a>
          . All Rights Reserved.
          <p className="mt-2">
            AnimeDen does not store any files on our server; we only link to the media hosted on 3rd-party services.
          </p>
        </span>
      </div>
    </footer>
  )
}