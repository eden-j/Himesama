# Libraries
Himesama = require './himesama'
{el}     = require './himesama'

# DOM
p = el 'p'


module.exports = Count = Himesama.Component

  needs: [ 'counter' ]
  render: ->

    console.log 'Rendering count'

    p className: 'point', 
      'Count : ' + @state.counter