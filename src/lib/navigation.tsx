'use client'

import NextLink from 'next/link'
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation'
import {
  useCallback,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  to: string
}

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />
}

type NavLinkState = { isActive: boolean }
type NavLinkProps = Omit<LinkProps, 'className'> & {
  className?: string | ((state: NavLinkState) => string)
  children?: ReactNode | ((state: NavLinkState) => ReactNode)
}

function routePath(to: string) {
  return to.split(/[?#]/, 1)[0] || '/'
}

export function NavLink({ to, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const target = routePath(to)
  const isActive = pathname === target || (target !== '/' && pathname.startsWith(`${target}/`))
  const state = { isActive }

  return (
    <NextLink href={to} className={typeof className === 'function' ? className(state) : className} {...props}>
      {typeof children === 'function' ? children(state) : children}
    </NextLink>
  )
}

type NavigateOptions = { replace?: boolean; state?: unknown }

export function useNavigate() {
  const router = useRouter()

  return useCallback((to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (to < 0) router.back()
      else if (to === 0) router.refresh()
      return
    }

    if (options?.replace) router.replace(to)
    else router.push(to)
  }, [router])
}

export function useLocation() {
  const pathname = usePathname()
  const searchParams = useNextSearchParams()
  const search = searchParams.toString()

  return useMemo(() => ({
    pathname,
    search: search ? `?${search}` : '',
    hash: '',
    state: null,
    key: pathname,
  }), [pathname, search])
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  const params = useNextParams()

  return useMemo(() => Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as T, [params])
}

type SearchParamsInit = URLSearchParams | string | Record<string, string | string[]> | [string, string][]
type SetSearchParams = (
  next: SearchParamsInit | ((current: URLSearchParams) => SearchParamsInit),
  options?: NavigateOptions,
) => void

function createSearchParams(init: SearchParamsInit) {
  if (typeof init === 'string' || init instanceof URLSearchParams || Array.isArray(init)) {
    return new URLSearchParams(init)
  }

  const params = new URLSearchParams()
  Object.entries(init).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]
    values.forEach((entry) => params.append(key, entry))
  })
  return params
}

export function useSearchParams(): [URLSearchParams, SetSearchParams] {
  const readonlyParams = useNextSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const serialized = readonlyParams.toString()
  const params = useMemo(() => new URLSearchParams(serialized), [serialized])

  const setParams = useCallback<SetSearchParams>((next, options) => {
    const current = new URLSearchParams(readonlyParams.toString())
    const resolved = typeof next === 'function' ? next(current) : next
    const query = createSearchParams(resolved).toString()
    const url = query ? `${pathname}?${query}` : pathname
    if (options?.replace) router.replace(url, { scroll: false })
    else router.push(url, { scroll: false })
  }, [pathname, readonlyParams, router])

  return [params, setParams]
}
