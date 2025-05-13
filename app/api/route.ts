import { Config, getNewConfig } from '@/lib/config';
import { decodeRules } from '@/lib/rules';
import { NextRequest } from 'next/server';
import YAML from 'yaml'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rules = searchParams.get('rules');
  const sub = searchParams.get('sub');

  if (!rules) {
    return new Response('Missing rules', { status: 400 })
  }

  if (!sub) {
    return new Response('Missing sub', { status: 400 })
  }

  let config: Config
  let headers: HeadersInit;

  try {
    const url = decodeURIComponent(sub)
    const response = await fetch(
      url.includes('?')
        ? url.endsWith('&flag=meta')
          ? url
          : url.concat('&flag=meta')
        : url)

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status })
    }

    const text = await response.text()
    config = YAML.parse(text)
    headers = response.headers
  } catch (e) {
    console.log(e)
    return new Response('Error fetching sub', { status: 500 })
  }

  let decodedRules

  try {
    decodedRules = decodeRules(rules)
  } catch (e) {
    console.log(e)
  }

  if (!decodedRules) {
    return new Response('Error decoding rules', { status: 500 })
  }

  let newConfig

  try {
    newConfig = getNewConfig(config, decodedRules)
  } catch (e) {
    console.log(e)
  }

  if (!newConfig) {
    return new Response('Error generating new config', { status: 500 })
  }

  return new Response(
    YAML.stringify(newConfig),
    {
      headers
    },
  );
}