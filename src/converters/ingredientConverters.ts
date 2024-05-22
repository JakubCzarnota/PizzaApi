export const ingredientModelToIngredientDto = (ingredientModel: IIngredientModel): IIngredientDto => {
    return {
        id: ingredientModel.id,
        name: ingredientModel.name
    }
}