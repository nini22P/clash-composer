import { Body1, Link, Subtitle2, Title1 } from "@fluentui/react-components";

export default function Header() {
  return (
    <header className='flex justify-between items-center p-4'>
      <div>
        <h1><Title1>Clash Composer</Title1></h1>
        <Body1>为 Clash 订阅添加额外规则</Body1>
      </div>

      <Link
        href='https://github.com/nini22P/clash-composer'
        target='_blank'
        appearance='subtle'
      >
        <Subtitle2>GitHub</Subtitle2>
      </Link>

    </header>
  )
}