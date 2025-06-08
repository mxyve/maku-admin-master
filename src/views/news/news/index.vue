<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="title">
				<el-input v-model="state.queryForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item prop="content">
				<el-input v-model="state.queryForm.content" placeholder="内容"></el-input>
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
			<el-space>
				<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button plain icon="Download" @click="downloadHandle('/test/news/export')">导出</el-button>
			</el-space>
			<el-space>
				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
			</el-space>
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
			<el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="内容" header-align="center" align="center"> </el-table-column>
			<el-table-column prop="adminId" label="管理员ID" header-align="center" align="center"></el-table-column>
			<el-table-column label="封面图片" header-align="center" align="center" width="100">
				<template #default="scope">
					<el-image v-if="scope.row.coverImage" :src="scope.row.coverImage" width="60" height="40" fit="cover" @error="handleImageError" />
					<div v-else class="no-image-placeholder">无图片</div>
				</template>
			</el-table-column>
			<el-table-column prop="source" label="资讯来源" header-align="center" align="center"></el-table-column>
			<el-table-column prop="viewCount" label="浏览量" header-align="center" align="center"></el-table-column>
			<el-table-column label="状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdateRef" v-model:visible="addOrUpdateVisible" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="TestNewsIndex">
import { useCrud } from '@/hooks'
import { reactive, nextTick, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/test/news/page',
	deleteUrl: '/test/news',
	queryForm: {
		title: '',
		content: ''
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
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateVisible.value = true
	nextTick(() => addOrUpdateRef.value.init(id))
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)

// 状态文本映射
const getStatusText = (status: string | number) => {
	const map = {
		'0': '草稿',
		'1': '已发布',
		'2': '已下架'
	}
	return map[status.toString()] || '未知'
}

// 状态标签样式映射
const getStatusType = (status: string | number) => {
	const map = {
		'0': 'info',
		'1': 'success',
		'2': 'warning'
	}
	return map[status.toString()] || 'default'
}

// 图片加载失败处理
const handleImageError = (e: Event) => {
	;(e.target as HTMLImageElement).src = '/static/default-image.png' // 替换为你的默认图片路径
}
</script>

<style scoped>
.content-preview {
	max-height: 60px;
	overflow: hidden;
	line-height: 1.5;
	text-overflow: ellipsis;
}

.no-image-placeholder {
	color: #909399;
	font-size: 12px;
}
</style>
