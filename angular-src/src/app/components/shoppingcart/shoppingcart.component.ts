import { Component, OnInit } from '@angular/core'
import { ShoppingcarService } from '../../services/shoppingcar.service'
import { UserService } from '../../services/user.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ValidateService } from '../../services/validate.service'
// import { element } from 'protractor'

@Component({
	selector: 'app-shoppingcart',
	templateUrl: './shoppingcart.component.html',
	styleUrls: ['./shoppingcart.component.scss']
})

export class ShoppingcartComponent implements OnInit {
	myCartId: String
	products: Array<Object>
	isEmpty: Boolean
	shippingAddress: Array<Object>	
	defaultPos: Number = 0		// la uso para obtener el id de la direccion en el checkout
	shippingCost: Number = 0	// la uso para obtener el id del shipping cost en el checkout

	optionsSelect: Array<any>
	ItemsPrice
	ShippingPrice = 0
	Tax = 0
	TotalPrice = 0
	length = 0
	sessionData: any
	
	// Reactive Forms and validate variables
	AddAddressForm: FormGroup
	isValidQty = []
	CheckoutForm: FormGroup

	constructor(private shoppingcarService: ShoppingcarService,
		private formBuilder: FormBuilder,
		private userService: UserService,
		private validateService: ValidateService) {
		
		this.AddAddressForm = formBuilder.group({
			street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
			apt: '',
			city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
			state: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
			zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
			default: ''
		})

		// this.CheckoutForm = formBuilder.group({
		// 	shipping_address: ['', Validators.required]			
		// })

		this.sessionData = JSON.parse(localStorage.getItem('user')) //getting the session values
	}

	ngOnInit() {
		this.getCartItems()
		this.getShippingAddress()
	}

	getCartItems() {
		const userID = this.sessionData.id
		// Observable (si no pongo el id dentro de un Object no funciona)
		this.shoppingcarService.getShoppingCart(userID).subscribe(data => {
			// console.log(data)
			if (!data.isEmpty) {
				// console.log(data)
				this.isEmpty = false
				this.myCartId = data.cart._id
				this.products = data.cart.products

				// console.log(data.cart)

				// Actualizo ItemsPrice
				this.ItemsPrice = 0
				this.products.forEach( (item, index) => {
					// this.ItemsPrice += parseFloat(item.price) // de esta forma me da error
					this.ItemsPrice += (parseFloat(item['price']) * item['qty'])
					
					// Setting the Qty Validation Array
					this.isValidQty[index] = true
				})

				// Actualizo Tax
				this.Tax = parseFloat(((this.ItemsPrice * 7) / 100).toFixed(2))

				// Actualizo TotalPrice
				this.TotalPrice = this.ItemsPrice + this.ShippingPrice + this.Tax

			} else {
				this.isEmpty = true
				console.log(data.msg)
			}
		})
	}

	getShippingAddress() {
		const userID = this.sessionData.id
		// Observable (si no pongo el id dentro de un Object no funciona)
		this.userService.getShippingAddress(userID).subscribe(result => {
			if (!result.isEmpty) {
				// Asigno las shipping address para poder mostrarlas en el {{template}}
				this.shippingAddress = result.arrayAddress

				// console.log(result.arrayAddress)

				result.arrayAddress.forEach((dir, index) => {
					if(dir.default)
						this.defaultPos = index
				})
			}
		})
	}

	shippingOption(charge) {
		// Actualizo ShippingPrice
		this.ShippingPrice = charge

		// Actualizo TotalPrice
		this.TotalPrice = this.ItemsPrice + parseFloat(charge) + this.Tax
	}

	qtyChanged(index, qty, prod_id) {
		if (this.validateService.validateBt_1_99(qty)) {
			this.isValidQty[index] = true
			// Actualizo qty en la db
			let data = {
				_idCart: this.myCartId, 	 // a que carro
				_idProd: prod_id,			 // que producto
				qty: qty					 // y que cantidad	
			}
			this.shoppingcarService.changeQtyOfItems(data).subscribe(result => {
				if(result.success) {
					this.getCartItems()
				} else {
					console.log("something is wrong")
				}
			})
		}
		this.isValidQty[index] = false
	}

	AddAddress() {
		// Agrego el userID dentro de la direccion para saber a quien se la voy a agregar
		this.AddAddressForm.value['userID'] = this.sessionData.id

		// Observable
		this.userService.addShippingAddressToUser(this.AddAddressForm.value).subscribe(result => {
			if (result.success) {
				// Reset the new address form
				this.AddAddressForm.reset()

				// Actualizo las direcciones en el template
				this.getShippingAddress()
			} else {
				console.log(result.msg)
			}
		})
	}

	removeItem(prod_id) {
		let ids= {
			idCart: this.myCartId,
			idProd: prod_id
		}
		this.shoppingcarService.removeItem(ids).subscribe(result => {
			if (result.success) {
				//reload the products area
				this.getCartItems()

				// actualizo el badge de la variable de session
				var badge = JSON.parse(localStorage.getItem('cart')) //getting the badge current qty
				var newBadge = badge - 1
				localStorage.setItem('cart', newBadge.toString())

				// poner el valor en el navbar badge
				this.shoppingcarService.updatingQty(newBadge)
			} else {
				console.log("something is wrong")
			}
		})
	}

	checkout() {
		let shipping_address = {
			recipient_name: this.sessionData.name,
			line1: this.shippingAddress[this.defaultPos.toString()].street,
			city: this.shippingAddress[this.defaultPos.toString()].city,
			state: this.shippingAddress[this.defaultPos.toString()].state,
			postal_code: this.shippingAddress[this.defaultPos.toString()].zip,
			country_code: "US"
		}

		let items = []
		this.products.forEach((element, index) => {
			items[index] = {
				"name": element['name'],
				"sku": element['prod_id'],
				"price": element['price'],
				"currency": "USD",
				"quantity": element['qty']
			}
		})

		let payInfo = {
			shipping_address: shipping_address,
			amountPrice: this.ItemsPrice,
			products: items
		}
		
		// console.log(payInfo)

		this.shoppingcarService.checkout(payInfo).subscribe(result => {
			if (result.success) {
				// console.log(result)
				window.open(result.url, "_blank");
			} else {
				console.log("something is wrong")
			}
		})
	}

}
