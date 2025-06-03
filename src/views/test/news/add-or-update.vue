<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-width="100">
			<el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<ma-editor v-model="dataForm.content" placeholder="内容"></ma-editor>
			</el-form-item>
			<el-form-item label="管理员ID" prop="adminId">
				<el-input v-model="dataForm.adminId" placeholder="管理员ID"></el-input>
			</el-form-item>
			<el-form-item label="封面图片URL" prop="coverImage">
				<el-input v-model="dataForm.coverImage" placeholder="封面图片URL"></el-input>
			</el-form-item>
			<el-form-item label="资讯来源" prop="source">
				<el-input v-model="dataForm.source" placeholder="资讯来源"></el-input>
			</el-form-item>
			<el-form-item label="浏览量" prop="viewCount">
				<el-input v-model="dataForm.viewCount" placeholder="浏览量"></el-input>
			</el-form-item>
			<el-form-item label="状态：0-草稿，1-已发布，2-已下架" prop="status">
				<el-input v-model="dataForm.status" placeholder="状态：0-草稿，1-已发布，2-已下架"></el-input>
			</el-form-item>
			<el-form-item label="创建时间" prop="createTime">
				<el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
			</el-form-item>
			<el-form-item label="更新时间" prop="updateTime">
				<el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useTestNewsApi, useTestNewsSubmitApi } from '@/api/test/news'

const emit = defineEmits(['refreshDataList'])

const visible = defineModel<boolean>('visible')
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	title: '',
	content: '',
	adminId: '',
	createTime: '',
	updateTime: '',
	deleted: '',
	viewCount: '',
	status: '',
	coverImage: '',
	source: ''
})

const init = (id?: number) => {
	if (id) {
		getNews(id)
	}
}

const getNews = (id: number) => {
	useTestNewsApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	adminId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	viewCount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	coverImage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	source: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async (valid: boolean) => {
		if (!valid) {
			return false
		}

		useTestNewsSubmitApi(dataForm).then(() => {
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

defineExpose({
	init
})
</script>
