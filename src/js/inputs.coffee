# Libraries
Himesama = require './himesama'
{el}     = require './himesama'


p     = el 'p'
div   = el 'div'
input = el 'input'


Inputs = Himesama.Component

  state: Himesama.getStore()

  handleUp: (event) ->
    @setState counter: @state.counter + 1

  handleDown: (event) ->
    @setState counter: @state.counter - 1

  render: ->

    div null,
      
      input 
        onClick:   @handleUp
        value:     '+ 1'
        type:      'submit'
      
      input 
        onClick:   @handleDown
        value:     '- 1'
        type:      'submit'


module.exports = Inputs