<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="state.queryForm.name" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<el-select v-model="state.queryForm.status" placeholder="请选择设备状态">
					<el-option label="在线" value="1"></el-option>
					<el-option label="离线" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			<el-button plain icon="Download" @click="downloadHandle('/equipment/device/export')">导出</el-button>
			<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
		</el-space>

		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			class="layout-table"
			show-overflow-tooltip
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="设备ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="deviceId" label="设备标识" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="设备名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="设备类型" header-align="center" align="center">
				<template #default="scope">
					{{ getDeviceTypeText(scope.row.type) }}
				</template>
			</el-table-column>
			<el-table-column prop="location" label="设备位置" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="设备状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
						{{ scope.row.status === 1 ? '在线' : '离线' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="二维码" header-align="center" align="center" width="120">
				<template #default="scope">
					<el-image v-if="scope.row.picture" :src="scope.row.picture" width="80" height="80" :preview-src-list="[scope.row.picture]" />
					<span v-else>无</span>
				</template> </el-table-column
			><!-- <el-table-column prop="isOpen" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="danger" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		/>

		<!-- 新增/修改弹窗 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible" @refreshDataList="getDataList"></add-or-update>
	</el-card>

	<el-button @click="showDataList">显示数据</el-button>
</template>

<script setup lang="ts" name="EquipmentEquipmentIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { ElMessageBox } from 'element-plus'
import { useEquipmentGetQrcodeApi } from '@/api/equipment/qrcode'

const state = reactive({
	dataListUrl: '/equipment/device/page',
	deleteUrl: '/equipment/device',
	queryForm: {
		name: '',
		status: ''
	},
	page: 1,
	limit: 10,
	pageSizes: [10, 20, 50, 100],
	total: 0,
	dataList: [],
	dataListLoading: false
})

const queryRef = ref()
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)

// 设备类型文本映射
const deviceTypeMap = {
	0: '灯',
	1: '门锁',
	2: '灌溉器',
	3: '喂食器'
}

const getDeviceTypeText = (type: number) => {
	return deviceTypeMap[type] || '未知'
}

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const showDataList = () => {
	console.log('当前数据:', state.dataList)
	// 或者弹窗显示
	ElMessageBox.alert(JSON.stringify(state.dataList, null, 2), '数据列表', {
		confirmButtonText: '确定',
		customClass: 'data-list-modal'
	})
}

// 初始化加载数据
getDataList()
</script>

<style scoped>
.layout-table {
	margin-top: 16px;
}
</style>
