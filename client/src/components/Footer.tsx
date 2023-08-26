"use client"
import Link from "next/link";

export default function Footer() {

  return (
    <footer className='pt-8'>
      <p className="copyright">
        <span>©</span>
        <span>PromptHouse</span>
        <span>{new Date().getFullYear()}</span>
      </p>
      <div className="otherpages">
        <Link href=""></Link>
      </div>
    </footer>
  )
}
