# Libraries
Himesama                  = require './himesama'
{ el,  Doc, Render }      = Himesama
{ Component, initState }  = Himesama
Render                    = Himesama.getRender()
{ getElementById }        = Doc


p     = el 'p'
div   = el 'div'
input = el 'input'


initialState = 
  title:       'Himesama..'
  catchPhrase: 'Lets make websites senpai!!'
  counter:     0

Himesama.initState initialState


Inputs = require './inputs'


App = Himesama.Component

  state: Himesama.getStore()

  needs: [
    'title'
    'catchPhrase'
    'counter'
  ]

  render: ->

    div null,
      p null, @state.title
      p null, @state.catchPhrase 
      p null, 'Counter : ' + @state.counter
      Inputs

Render App, getElementById 'mount'

