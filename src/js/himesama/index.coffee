_           = require 'lodash'
{ createTextNode
  getElementById
  createElement
  querySelectorAll
  activeElement } = require './himesama-doc'


module.exports = Himesama =
  
  el: (type) ->
    ->
      args       = arguments 
      attributes = args[0]
      innerHTML  = []
      _.forEach ([ 0 .. (args.length - 1) ].slice 1), (i) -> 
        innerHTML.push args[i]
      
      output = createElement type

      if attributes?
        _.forEach (_.keys attributes), (key) =>
          attribute = attributes[key]

          switch key
            when 'onClick'
              output.addEventListener 'click', attribute
            when 'onKeyDown'
              output.addEventListener 'keydown', attribute
            else
              output.setAttribute key, attribute

      _.forEach innerHTML, (child, ci) ->
        if child?
          if typeof child is 'string'
            child = createTextNode child

          output.appendChild child

      output


  MountPoint: undefined
  Root:       undefined
  Render: (root, mountPoint) ->
    if mountPoint?
      @MountPoint = mountPoint
    if root?
      @Root       = root

    (querySelectorAll '[himesama-id]')[0]?.remove()

    rendering = @Root.render()
    rendering.setAttribute 'himesama-id', '.0'
    checkChildren = (element, address) ->
      _.forEach element.children, (child, ci) ->
        child.setAttribute 'himesama-id', address + '.' + ci
        checkChildren child,              address + '.' + ci
    checkChildren rendering, '.0'

    @MountPoint.appendChild rendering

  getRender: ->
    @Render.bind @

  initState: (state) ->
    @state      = state
    @components = _.mapValues state, -> []

  getStore: -> @state

  setState: (newValue) -> 
    _.forEach (_.keys newValue), (key) =>
      @state[key] = newValue[key]
    @Render()

  component: (c) -> 
    c.setState    = @setState.bind Himesama
    c.handleUp    = c.handleUp.bind c
    c.handleDown  = c.handleDown.bind c
    c


  Doc: require './himesama-doc'


  