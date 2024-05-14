# PizzaApi
## About
PizzaApi is a Node.js api written in TypeScript using express js.
## Documentation 
The documentation includes list of all controllers with all endpoints.
### Pizza Controller
Pizza Controler - responsible for all the actions involveing pizza

|Method|Description|Route|Request body|Response body|Possible errors|
|---|---|---|---|---|---|
|GET|Returns all pizzas|.../api/pizzas|━|``` [{id: number, name: String, price: number,ingredients: String[]}, ...] ```|━|
|GET|Returns pizza with selected id|.../api/pizzas/{id}|━|``` {id: number, name: String, price: number,ingredients: String[]} ```|Not found error, Validation Error|
|POST|Creates pizza|.../api/pizzas/|``` {name: String, price: number, ingredients: number[],} ```|*New pizza's id*|Validation error|
|DELETE|Deletes pizza with selected id|.../api/pizzas/{id}|━|Pizza deleted successfully|Not found error, Validation Error|
|PATCH|Updates properties of pizza with selected id|.../api/pizzas/{id}|``` {name?: String, price?: number,ingredients?: number[]} ```|Pizza updated successfully|Not found error, Validation Error|

---

### Ingredient Controller
Ingredient Controler - responsible for all the actions involveing ingredients

|Method|Description|Route|Request body|Response body|Possible errors|
|---|---|---|---|---|---|
|GET|Returns all ingredients|.../api/ingredients|━|``` [{id: number, name: String, ...] ```|━|
|GET|Returns ingredient with selected id|.../api/ingredients/{id}|━|``` {id: number, name: String} ```|Not found error, Validation Error|
|POST|Creates ingredient|.../api/ingredients/|``` {name: String} ```|*New ingredient's id*|Validation Error
|DELETE|Deletes ingredient with selected id|.../api/ingredients/{id}|━|Ingredient deleted successfully|Not found error, Validation Error|
|PATCH|Updates properties of ingredient with selected id|.../api/ingredients/{id}|``` {name: String} ```|Ingredient updated successfully|Not found error, Validation Error|

---

### Order Controller
Order Controler - responsible for all the actions involveing orders

|Method|Description|Route|Request body|Response body|Possible errors|
|---|---|---|---|---|---|
|GET|Returns all orders|.../api/orders|━|``` [{id: number, first_name: string, last_name: string, phone_number: string, city: string, street: string, building_number: string pizzas: IPizzaDto[]}, ...] ```|━|
|GET|Returns order with selected id|.../api/orders/{id}|━|``` {id: number, first_name: string, last_name: string, phone_number: string, city: string, street: string, building_number: string pizzas: IPizzaDto[]}, ```|Not found error, Validation Error|
|POST|Creates order|.../api/orders/|``` {first_name: string, last_name: string, phone_number: string, city: string, street: string, building_number: string pizzas: number[]}, ```|*New order's id*|Validation Error|
|DELETE|Deletes order with selected id|.../api/orders/{id}|━|Order deleted successfully|Not found error|
|PATCH|Updates properties of order with selected id|.../api/orders/{id}|``` {first_name?: string, last_name?: string, phone_number?: string, city?: string, street?: string, building_number?: string pizzas?: number[]}, ```|Order updated successfully|Not found error, Validation Error|
