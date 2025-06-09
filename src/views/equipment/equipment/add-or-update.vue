<template>
	<el-dialog
		v-model="visible"
		:title="!dataForm.id ? '新增设备' : '修改设备'"
		:close-on-click-modal="false"
		draggable
		width="600px"
		class="equipment-dialog"
	>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" label-position="left">
			<el-row :gutter="20">
				<el-col :span="15">
					<el-form-item label="设备ID:" prop="deviceId">
						<el-input v-model="dataForm.deviceId" placeholder="请输入设备ID" clearable />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="15">
					<el-form-item label="设备名称:" prop="name">
						<el-input v-model="dataForm.name" placeholder="请输入设备名称" clearable />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 二维码显示区域 -->
			<el-form-item label="二维码预览">
				<div v-if="qrcodePicture" class="qrcode-preview">
					<el-image :src="qrcodePicture" :preview-src-list="[qrcodePicture]" style="width: 120px; height: 120px" />
				</div>
				<div v-else class="qrcode-placeholder">
					<span>暂无二维码</span>
				</div>
			</el-form-item>

			<!-- 二维码操作按钮 -->
			<el-form-item label="二维码操作">
				<el-button type="primary" icon="el-icon-qrcode" @click="generateQrcode()" :disabled="!dataForm.deviceId">生成二维码</el-button>
				<el-button type="danger" icon="el-icon-delete" @click="deleteQrcode()" :disabled="!dataForm.qrcodeId">删除二维码</el-button>
			</el-form-item>

			<el-form-item label="设备类型:" prop="type">
				<el-radio-group v-model="dataForm.type">
					<el-radio-button :value="0">灯</el-radio-button>
					<el-radio-button :value="1">门锁</el-radio-button>
					<el-radio-button :value="2">灌溉器</el-radio-button>
					<el-radio-button :value="3">喂食器</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="设备位置:" prop="location">
				<ma-address v-model="dataForm.location" placeholder="请选择设备位置" style="width: 100%" />
			</el-form-item>

			<el-form-item label="设备状态:" prop="status">
				<el-switch v-model="dataForm.status" active-text="在线" inactive-text="离线" :active-value="1" :inactive-value="0" />
			</el-form-item>

			<el-row :gutter="20" v-if="dataForm.id">
				<el-col :span="12">
					<el-form-item label="创建时间:">
						<el-input v-model="dataForm.createTime" disabled />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" v-if="dataForm.id">
				<el-col :span="12">
					<el-form-item label="更新时间:">
						<el-input v-model="dataForm.updateTime" disabled />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="submitHandle">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEquipmentEquipmentApi, useEquipmentEquipmentSubmitApi } from '@/api/equipment/equipment'
import { useEquipmentGenerateQrcodeApi, useEquipmentDeleteQrcodeApi, useEquipmentGetQrcodeApi } from '@/api/equipment/qrcode'

const emit = defineEmits(['refreshDataList'])
const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	deviceId: '',
	name: '',
	qrcodeId: '',
	type: 0,
	location: '',
	status: 1,
	deleted: '',
	createTime: '',
	updateTime: ''
})

const qrcodePicture = ref('')

const init = (id?: number) => {
	if (id) {
		getEquipment(id)
	} else {
		// 新增时重置表单
		resetForm()
	}
}

const resetForm = () => {
	Object.assign(dataForm, {
		id: '',
		deviceId: '',
		name: '',
		qrcodeId: '',
		type: 0,
		location: '',
		status: 1,
		deleted: '',
		createTime: '',
		updateTime: '',
		isOpen: 0
	})
	qrcodePicture.value = ''
}

const getEquipment = (id: number) => {
	useEquipmentEquipmentApi(id).then(res => {
		Object.assign(dataForm, res.data)
		// 获取二维码图片
		if (dataForm.deviceId) {
			getQrcodeInfo()
		}
	})
}

const dataRules = ref({
	deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
	name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
	type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
	location: [{ required: true, message: '请选择设备位置', trigger: 'change' }],
	status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useEquipmentEquipmentSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

// 生成二维码
const generateQrcode = async () => {
	if (!dataForm.deviceId) {
		ElMessage.warning('请先填写设备ID')
		return
	}

	try {
		await useEquipmentGenerateQrcodeApi(dataForm.deviceId)
		ElMessage.success('二维码生成成功')
		// 刷新二维码信息
		await getQrcodeInfo()
	} catch (error) {
		ElMessage.error('生成二维码失败')
	}
}

// 删除二维码
const deleteQrcode = async () => {
	if (!dataForm.qrcodeId) {
		ElMessage.warning('暂无二维码可删除')
		return
	}

	ElMessageBox.confirm('确定要删除该二维码吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(async () => {
			try {
				await useEquipmentDeleteQrcodeApi(dataForm.qrcodeId)
				ElMessage.success('二维码删除成功')
				// 重置二维码信息
				dataForm.qrcodeId = ''
				qrcodePicture.value = ''
			} catch (error) {
				ElMessage.error('删除二维码失败')
			}
		})
		.catch(() => {
			// 用户取消操作
		})
}

// 获取二维码信息
const getQrcodeInfo = async () => {
	if (!dataForm.deviceId) return

	try {
		const res = await useEquipmentGetQrcodeApi(dataForm.deviceId)
		if (res.data) {
			dataForm.qrcodeId = res.data.id
			qrcodePicture.value = res.data.picture
		} else {
			dataForm.qrcodeId = ''
			qrcodePicture.value = ''
		}
	} catch (error) {
		ElMessage.warning('获取二维码信息失败')
	}
}

// 监听设备ID变化，自动获取二维码
watch(
	() => dataForm.deviceId,
	newVal => {
		if (newVal && !dataForm.id) {
			// 新增场景下，设备ID变化时尝试获取二维码
			getQrcodeInfo()
		}
	}
)

defineExpose({
	init
})
</script>

<style lang="scss" scoped>
.equipment-dialog {
	.el-form-item {
		margin-bottom: 18px;
	}

	.el-input,
	.el-select,
	.el-cascader {
		width: 100%;
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
	}

	.qrcode-preview {
		width: 120px;
		height: 120px;
		border: 1px solid #ebeef5;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qrcode-placeholder {
		width: 120px;
		height: 120px;
		border: 1px dashed #ebeef5;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #909399;
	}
}
</style>
