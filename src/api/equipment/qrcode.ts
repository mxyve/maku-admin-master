// @/api/equipment/qrcode.ts
import request from '@/utils/request'

// 生成二维码（使用命名导出）
export const useEquipmentGenerateQrcodeApi = (deviceId: string) => {
	return request({
		url: `/equipment/device/${deviceId}/generate-qrcode`,
		method: 'post'
	})
}

// 删除二维码（使用命名导出）
export const useEquipmentDeleteQrcodeApi = (qrcodeId: number) => {
	return request({
		url: `/equipment/device/qrcode/${qrcodeId}`,
		method: 'delete'
	})
}

// 获取二维码信息（使用命名导出）
export const useEquipmentGetQrcodeApi = (deviceId: string) => {
	return request({
		url: `/equipment/device/qrcode/by-device-id/${deviceId}`,
		method: 'get'
	})
}
