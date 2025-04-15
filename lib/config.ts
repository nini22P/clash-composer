import { Rules } from './rules'

export interface Proxy {
  name: string
}

export interface ProxyGroup {
  name: string,
}

export interface Config {
  'proxy-groups': ProxyGroup[],
  proxies: Proxy[],
  rules: string[],
}

// 生成规则
const newRules = (config: Config, rules: Rules) => {
  const defaultProxy = config['proxy-groups'][0].name
  const generateRule = (type: string, items: string[], proxy: string) => items.map(item => `${type},${item},${proxy}`)

  return [
    ...generateRule('DOMAIN-KEYWORD', rules.proxyDomainKeywords, defaultProxy),
    ...generateRule('DOMAIN-SUFFIX', rules.proxyDomains, defaultProxy),
    ...generateRule('IP-CIDR', rules.proxyIPs, defaultProxy),
    ...generateRule('GEOSITE', rules.proxyGeoSites, defaultProxy),
    ...generateRule('GEOIP', rules.proxyGeoIPs, defaultProxy),
    ...generateRule('DOMAIN-KEYWORD', rules.directDomainKeywords, 'DIRECT'),
    ...generateRule('DOMAIN-SUFFIX', rules.directDomains, 'DIRECT'),
    ...generateRule('IP-CIDR', rules.directIPs, 'DIRECT,no-resolve'),
    ...generateRule('GEOSITE', rules.directGeoSites, 'DIRECT'),
    ...generateRule('GEOIP', rules.directGeoIPs, 'DIRECT'),
  ]
}

// 生成代理组规则
const newProxyGroupsRules = (rules: Rules) => rules.proxyGroups.flatMap(group => {
  const rules = []

  if (group.domainKeywords && group.domainKeywords.length > 0) {
    rules.push(...group.domainKeywords.map(keyword => `DOMAIN-KEYWORD,${keyword},${group.name}`))
  }
  if (group.domains && group.domains.length > 0) {
    rules.push(...group.domains.map(domain => `DOMAIN-SUFFIX,${domain},${group.name}`))
  }
  if (group.geoSites && group.geoSites.length > 0) {
    rules.push(...group.geoSites.map(site => `GEOSITE,${site},${group.name}`))
  }
  if (group.geoIPs && group.geoIPs.length > 0) {
    rules.push(...group.geoIPs.map(ip => `GEOIP,${ip},${group.name}`))
  }

  return rules
})

// 生成代理组
const newProxyGroups = (config: Config, rules: Rules) => {
  const defaultProxy = config['proxy-groups'][0].name;
  const proxies = config.proxies.map(proxy => proxy.name);

  return rules.proxyGroups.map(group => {
    const filteredProxies = group.filters.length > 0
      ? proxies.filter(proxy => group.filters.some(filter => proxy.toLowerCase().includes(filter.toLowerCase())))
      : proxies;
    return {
      name: group.name,
      type: 'select',
      proxies: group.directFirst
        ? ['DIRECT', defaultProxy, ...filteredProxies]
        : group.filters.length > 0
          ? [...filteredProxies, defaultProxy, 'DIRECT']
          : [defaultProxy, 'DIRECT', ...filteredProxies],
    };
  });
}

export const getNewConfig = (config: Config, rules: Rules) => {
  config.rules = [
    ...newRules(config, rules),
    ...newProxyGroupsRules(rules),
    ...config.rules,
  ]
  config['proxy-groups'].splice(1, 0, ...newProxyGroups(config, rules))

  return config
}

export const getClashVergeRevScript = (rules: Rules) =>
  `
// 代理域名关键词
const proxyDomainKeywords = ${JSON.stringify(rules.proxyDomainKeywords, null, 2)}

// 代理域名
const proxyDomains = ${JSON.stringify(rules.proxyDomains, null, 2)}

// 代理IP
const proxyIPs = ${JSON.stringify(rules.proxyIPs, null, 2)}

// 代理GEOSITE
const proxyGeoSites = ${JSON.stringify(rules.proxyGeoSites, null, 2)}

// 代理GEOIP
const proxyGeoIPs = ${JSON.stringify(rules.proxyGeoIPs, null, 2)}

// 直连域名关键词
const directDomainKeywords = ${JSON.stringify(rules.directDomainKeywords, null, 2)}

// 直连域名
const directDomains = ${JSON.stringify(rules.directDomains, null, 2)}

// 直连IP
const directIPs = ${JSON.stringify(rules.directIPs, null, 2)}

// 直连GEOSITE
const directGeoSites = ${JSON.stringify(rules.directGeoSites, null, 2)}

// 直连GEOIP
const directGeoIPs = ${JSON.stringify(rules.directGeoIPs, null, 2)}

/**
 * @typedef {Object} ProxyGroup
 * @property {string} name
 * @property {boolean} [directFirst]
 * @property {string[]} [filters]
 * @property {string[]} [domainKeywords]
 * @property {string[]} [domains]
 * @property {string[]} [geoSites]
 * @property {string[]} [geoIPs]
 */

/** 代理组
 *  @type {ProxyGroup[]}
 */
const proxyGroups = ${JSON.stringify(rules.proxyGroups, null, 2)}

// 生成规则
const newRules = (config) => {
  const defaultProxy = config['proxy-groups'][0].name
  const generateRule = (type, items, proxy) => items.map(item => \`\${type},\${item},\${proxy}\`)

  return [
    ...generateRule('DOMAIN-KEYWORD', proxyDomainKeywords, defaultProxy),
    ...generateRule('DOMAIN-SUFFIX', proxyDomains, defaultProxy),
    ...generateRule('IP-CIDR', proxyIPs, defaultProxy),
    ...generateRule('GEOSITE', proxyGeoSites, defaultProxy),
    ...generateRule('GEOIP', proxyGeoIPs, defaultProxy),
    ...generateRule('DOMAIN-KEYWORD', directDomainKeywords, 'DIRECT'),
    ...generateRule('DOMAIN-SUFFIX', directDomains, 'DIRECT'),
    ...generateRule('IP-CIDR', directIPs, 'DIRECT,no-resolve'),
    ...generateRule('GEOSITE', directGeoSites, 'DIRECT'),
    ...generateRule('GEOIP', directGeoIPs, 'DIRECT'),
  ]
}

// 生成代理组规则
const newProxyGroupsRules = () => proxyGroups.flatMap(group => {
  const rules = []

  if (group.domainKeywords && group.domainKeywords.length > 0) {
    rules.push(...group.domainKeywords.map(keyword => \`DOMAIN-KEYWORD,\${keyword},\${group.name}\`))
  }
  if (group.domains && group.domains.length > 0) {
    rules.push(...group.domains.map(domain => \`DOMAIN-SUFFIX,\${domain},\${group.name}\`))
  }
  if (group.geoSites && group.geoSites.length > 0) {
    rules.push(...group.geoSites.map(site => \`GEOSITE,\${site},\${group.name}\`))
  }
  if (group.geoIPs && group.geoIPs.length > 0) {
    rules.push(...group.geoIPs.map(ip => \`GEOIP,\${ip},\${group.name}\`))
  }

  return rules
})

// 生成代理组
const newProxyGroups = (config) => {
  const defaultProxy = config['proxy-groups'][0].name;
  const proxies = config.proxies.map(proxy => proxy.name);

  return proxyGroups.map(group => {
    const filteredProxies = group.filters.length > 0
      ? proxies.filter(proxy => group.filters.some(filter => proxy.toLowerCase().includes(filter.toLowerCase())))
      : proxies;
    return {
      name: group.name,
      type: 'select',
      proxies: group.directFirst
        ? ['DIRECT', defaultProxy, ...filteredProxies]
        : group.filters.length > 0
          ? [...filteredProxies, defaultProxy, 'DIRECT']
          : [defaultProxy, 'DIRECT', ...filteredProxies],
    };
  });
}


const main = (config) => {
  config.rules = [
    ...newRules(config),
    ...newProxyGroupsRules(),
    ...config.rules,
  ]
  config['proxy-groups'].splice(1, 0, ...newProxyGroups(config))
  return config
}
`