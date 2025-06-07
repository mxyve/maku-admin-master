import service from '@/utils/request'

export const useTestNewsApi = (id: number) => {
	return service.get('/test/news/' + id)
}

export const useTestNewsSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/test/news', dataForm)
	} else {
		return service.post('/test/news', dataForm)
	}
}
