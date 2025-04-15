import { Base64 } from 'js-base64'

export interface ProxyGroup {
  name: string,
  directFirst: boolean,
  filters: string[],
  domainKeywords: string[],
  domains: string[],
  geoSites: string[],
  geoIPs: string[],
}

export interface Rules {
  proxyDomainKeywords: string[],
  proxyDomains: string[],
  proxyIPs: string[],
  proxyGeoSites: string[],
  proxyGeoIPs: string[],
  directDomainKeywords: string[],
  directDomains: string[],
  directIPs: string[],
  directGeoSites: string[],
  directGeoIPs: string[],
  proxyGroups: ProxyGroup[]
}

export const emptyRules: Rules = {
  proxyDomainKeywords: [],
  proxyDomains: [],
  proxyIPs: [],
  proxyGeoSites: [],
  proxyGeoIPs: [],
  directDomainKeywords: [],
  directDomains: [],
  directIPs: [],
  directGeoSites: [],
  directGeoIPs: [],
  proxyGroups: []
}

export const defaultRules: Rules = {
  proxyDomainKeywords: [],
  proxyDomains: ['dl.tailscale.com'],
  proxyIPs: [],
  proxyGeoSites: ['github'],
  proxyGeoIPs: ['github'],
  directDomainKeywords: [],
  directDomains: ['bgm.tv'],
  directIPs: ['192.168.0.0/24'],
  directGeoSites: ['tailscale'],
  directGeoIPs: ['tailscale'],
  proxyGroups: [
    {
      name: 'Google',
      directFirst: false,
      filters: [],
      domainKeywords: [],
      domains: [],
      geoSites: ['google'],
      geoIPs: [],
    },
    {
      name: 'Microsoft',
      directFirst: true,
      filters: [],
      domainKeywords: [],
      domains: [],
      geoSites: ['microsoft'],
      geoIPs: []
    },
    {
      name: 'Apple',
      directFirst: true,
      filters: [],
      domainKeywords: [],
      domains: [],
      geoSites: ['apple'],
      geoIPs: []
    },
    {
      name: 'Spotify',
      directFirst: false,
      filters: [],
      domainKeywords: [],
      domains: [],
      geoSites: ['spotify'],
      geoIPs: [],
    },
    {
      name: 'E-Hentai',
      directFirst: false,
      filters: ['US', 'EU', 'UnitedStates', '美国', 'FR'],
      domains: ['e-hentai.org', 'exhentai.org'],
      domainKeywords: [],
      geoSites: [],
      geoIPs: [],
    },
    {
      name: 'DLsite',
      directFirst: false,
      filters: ['japan', '日本', 'jp'],
      domains: ['dlsite.com'],
      domainKeywords: [],
      geoSites: [],
      geoIPs: [],
    },
  ],
}

export const encodeRules = (configObj: object): string | null => {
  try {
    const jsonString = JSON.stringify(configObj)
    const base64String = Base64.encode(jsonString)
    return base64String
  } catch (e) {
    console.error('Error encoding config:', e)
    return null
  }
}

export const decodeRules = (base64String: string | undefined | null): Rules | null => {
  if (!base64String) return null
  try {
    const jsonString = Base64.decode(base64String)
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Error decoding config:', e)
    return null
  }
}