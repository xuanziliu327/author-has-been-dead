const HOME_HASH = '#/'

export function resetHashRouteBeforeMount(): void {
  if (window.location.hash === HOME_HASH) return

  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}${HOME_HASH}`,
  )
}
