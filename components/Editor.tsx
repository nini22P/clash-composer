import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { decodeRules, defaultRules, emptyRules, encodeRules, Rules } from '@/lib/rules'
import Chips from '@/components/Chips'
import { getClashVergeRevScript } from '@/lib/config'
import { Button, Card, CardHeader, Checkbox, Input, Subtitle1 } from '@fluentui/react-components'
import { bundleIcon, DismissFilled, DismissRegular } from '@fluentui/react-icons'

const DismissIcon = bundleIcon(DismissFilled, DismissRegular)

export default function Editor() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [subUrl, setSubUrl] = useState('')

  const [rules, setRules] = useState(() => decodeRules(searchParams.get('rules')) || defaultRules)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )


  useEffect(() => {
    const queryString = createQueryString('rules', encodeRules(rules) || '')
    const newPath = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newPath, { scroll: false })
  }, [createQueryString, pathname, router, rules])

  const copy = (text: string) =>
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard:', text);
      })
      .catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请查看控制台获取详情。');
      });

  const getSubUrl = (rules: Rules, subUrl: string) => {
    const origin = window.location.origin;
    const encodedSubUrl = encodeURIComponent(subUrl);
    return `${origin}/api?rules=${encodeRules(rules)}&sub=${encodedSubUrl}`;
  }

  return (
    <div className='flex flex-col p-2 gap-2'>
      <div className='pb-2 flex gap-2 justify-start items-center flex-wrap'>
        <Input
          type='url'
          value={subUrl}
          placeholder='原始 Clash 订阅链接'
          className='border px-1 w-full'
          onChange={(e) => setSubUrl(e.target.value)}
        />
        <Button
          disabled={subUrl.length === 0}
          onClick={() => {
            const url = getSubUrl(rules, subUrl)
            copy(url)
          }}
        >
          复制订阅链接
        </Button>
        <Button
          onClick={() => {
            const script = getClashVergeRevScript(rules)
            copy(script)
          }}
        >
          复制 Clash Verge Rev 全局扩展脚本
        </Button>
        <Button onClick={() => copy(window.location.href)}>
          复制规则链接
        </Button>
        <Button onClick={() => setRules(defaultRules)}>
          使用示例规则
        </Button>
        <Button onClick={() => setRules(emptyRules)}>
          清空规则
        </Button>
      </div>

      <Subtitle1>匹配规则</Subtitle1>

      <Card >
        <Chips
          label='代理域名关键词'
          items={rules.proxyDomainKeywords}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              proxyDomainKeywords: value
            }))
          }}
        />
        <Chips
          label='代理域名'
          items={rules.proxyDomains}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              proxyDomains: value
            }))
          }}
        />
        <Chips
          label='代理 IP'
          items={rules.proxyIPs}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              proxyIPs: value
            }))
          }}
        />
        <Chips
          label='代理 GeoSite'
          items={rules.proxyGeoSites}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              proxyGeoSites: value
            }))
          }}
        />
        <Chips
          label='代理 GeoIP'
          items={rules.proxyGeoIPs}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              proxyGeoIPs: value
            }))
          }}
        />
        <Chips
          label='直连域名关键词'
          items={rules.directDomainKeywords}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              directDomainKeywords: value
            }))
          }}
        />
        <Chips
          label='直连域名'
          items={rules.directDomains}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              directDomains: value
            }))
          }}
        />
        <Chips
          label='直连 IP'
          items={rules.directIPs}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              directIPs: value
            }))
          }}
        />
        <Chips
          label='直连 GeoSite'
          items={rules.directGeoSites}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              directGeoSites: value
            }))
          }}
        />
        <Chips
          label='直连 GeoIP'
          items={rules.directGeoIPs}
          onChange={(value) => {
            setRules(currentRules => ({
              ...currentRules,
              directGeoIPs: value
            }))
          }}
        />
      </Card>

      <Subtitle1 className='pt-2'>代理组</Subtitle1>
      {
        rules.proxyGroups.map((proxyGroup, index) => (
          <Card key={index} className='flex flex-col items-start gap-1'>
            <CardHeader
              className='w-full flex justify-between items-center'
              header={
                <Input
                  type='text'
                  value={proxyGroup.name}
                  placeholder='代理组名称'
                  className='border px-1 w-auto'
                  onChange={(e) => {
                    const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, name: e.target.value } : group))
                    setRules(currentRules => ({
                      ...currentRules,
                      proxyGroups: newProxyGroups
                    }))
                  }}
                />
              }
              action={
                <Button
                  icon={<DismissIcon />}
                  appearance='subtle'
                  onClick={() => {
                    const newProxyGroups = rules.proxyGroups.filter((_, i) => i !== index)
                    setRules(currentRules => ({
                      ...currentRules,
                      proxyGroups: newProxyGroups
                    }))
                  }}
                />
              }
            />
            <Checkbox
              label='直连优先'
              className='select-none'
              checked={proxyGroup.directFirst}
              onChange={(e) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, directFirst: e.target.checked } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
            <Chips
              label='过滤'
              items={proxyGroup.filters}
              onChange={(value) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, filters: value } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
            <Chips
              label='域名关键词'
              items={proxyGroup.domainKeywords}
              onChange={(value) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, domainKeywords: value } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
            <Chips
              label='域名'
              items={proxyGroup.domains}
              onChange={(value) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, domains: value } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
            <Chips
              label='GeoSite'
              items={proxyGroup.geoSites}
              onChange={(value) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, geoSites: value } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
            <Chips
              label='GeoIP'
              items={proxyGroup.geoIPs}
              onChange={(value) => {
                const newProxyGroups = rules.proxyGroups.map((group, i) => (i === index ? { ...group, geoIPs: value } : group))
                setRules(currentRules => ({
                  ...currentRules,
                  proxyGroups: newProxyGroups
                }))
              }}
            />
          </Card>
        ))
      }
      <Button
        className='border px-1 cursor-pointer'
        onClick={() => {
          const newGroup = {
            name: `New Group`,
            directFirst: false,
            filters: [],
            geoSites: [],
            domainKeywords: [],
            domains: [],
            geoIPs: [],
          }

          setRules(currentRules => ({
            ...currentRules,
            proxyGroups: [
              ...currentRules.proxyGroups,
              newGroup
            ]
          }))
        }}
      >
        添加代理组
      </Button>
    </div >
  )
}
