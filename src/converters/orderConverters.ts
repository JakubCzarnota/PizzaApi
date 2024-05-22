export const orderModelToOrderDto = (orderModel: IOrderModel, pizzaDtos: IPizzaDto[]): IOrderDto => {
    return {
        id: orderModel.id,
        first_name: orderModel.first_name,
        last_name: orderModel.last_name,
        phone_number: orderModel.phone_number,
        city: orderModel.city,
        street: orderModel.street,
        building_number: orderModel.building_number,
        pizzas: pizzaDtos
    }
}