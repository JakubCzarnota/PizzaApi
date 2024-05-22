export const pizzaModelToPizzaDto = (pizzaModel: IPizzaModel, ingredients: string[]): IPizzaDto => {
    return {
        id: pizzaModel.id,
        name: pizzaModel.name,
        price: pizzaModel.price,
        ingredients: ingredients,
        count: pizzaModel.count
    }
}