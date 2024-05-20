export const AddressModelToAddressDto = (adressModel: IAddressModel): IAddressDto => {
    return {
        id: adressModel.id,
        city: adressModel.city,
        street: adressModel.street,
        buildingNumber: adressModel.building_number
    }
}

