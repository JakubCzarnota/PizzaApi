export const orderModelToOrderDto = (orderModel: IOrderModel, pizzaDtos: IPizzaDto[]): IOrderDto => {
    return {
        id: orderModel.id,
        firstName: orderModel.firstName,
        lastName: orderModel.lastName,
        phoneNumber: orderModel.phoneNumber,
        city: orderModel.city,
        street: orderModel.street,
        buildingNumber: orderModel.buildingNumber,
        pizzas: pizzaDtos
    }
}