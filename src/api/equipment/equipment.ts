import service from '@/utils/request'

export const useEquipmentEquipmentApi = (id: number) => {
	return service.get('/equipment/device/' + id)
}

export const useEquipmentEquipmentSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/equipment/device', dataForm)
	} else {
		return service.post('/equipment/device', dataForm)
	}
}
