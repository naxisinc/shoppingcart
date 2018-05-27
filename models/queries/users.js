db.users.insert({
  'name': 'Pedro Castillo',
  'email': 'laubiacastle@gmail.com',
  'password': '$2a$10$ho/VrbvUqpgeVPg.sn0FgOina5sUChVHkhFApp6aJ0nIuEHwSob1W',
  'buildingAddress': {
    'street': '5055 NW 7th ST',
    'apt': 'apt 909',
    'city': 'Miami',
    'state': 'Florida',
    'zip': '33126'
  },
  'shippingAddress': [
    {
      'street': '6816 NW 77st CT',
      'apt': '',
      'city': 'Miami',
      'state': 'Florida',
      'zip': '33166',
      'default': 'true'
    },
    {
      'street': '7764 NW 71st ST',
      'apt': '',
      'city': 'Miami',
      'state': 'Florida',
      'zip': '33166',
      'default': 'false'
    }
  ]
})

db.users.remove({ '_id': ObjectId('5ae874e360c653115c54942b') })

db.users.update(
  { '_id': ObjectId("5af0f507d5d3d92fe4b0adc3") },
  { $set: { "shippingAddress.$[elem].default": false } },
  { arrayFilters: [ { "elem.default": true } ] }
)