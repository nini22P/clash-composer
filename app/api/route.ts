import { getNewConfig } from '@/lib/config';
import { decodeRules } from '@/lib/rules';
import { NextRequest } from 'next/server';
import YAML from 'yaml'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rules = decodeRules(searchParams.get('rules'));
  const sub = searchParams.get('sub');

  if (!rules || !sub) {
    return new Response('Missing rules or sub', { status: 400 })
  }

  try {
    const url = decodeURIComponent(sub)
    const response = await fetch(url.endsWith('&flag=meta') ? url : url.concat('&flag=meta'))

    console.log(url)

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status })
    }

    const text = await response.text()
    const config = YAML.parse(text)

    const headers = response.headers

    const newConfig = getNewConfig(config, rules)

    return new Response(
      YAML.stringify(newConfig),
      {
        headers
      },
    );
  } catch (e) {
    console.log(e)
    return new Response('Error fetching sub', { status: 500 })
  }
}