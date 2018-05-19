import resolveNode from './resolve'

const wrapNode = node => node && (node.length ? node[0] : node)

const wrapView = view => (state, actions) => wrapNode(resolveNode(view(state, actions)))

export const withContext = app => (initialState, actionDefinitions, view, container) =>
  app(initialState, actionDefinitions, wrapView(view), container)

export default withContext
