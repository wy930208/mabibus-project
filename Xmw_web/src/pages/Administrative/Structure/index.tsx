import { NodeData, OrganizationGraph } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Card } from 'antd'
import { get } from 'lodash-es'
import type { FC } from 'react';

import { getOrganizationList } from '@/services/administrative/organization' // 组织管理接口

const Structure: FC = () => {
	function loopTree<T>(tree: (NodeData<{ name?: string }> & T &
	{ [key: string]: string })[], idField: string, nameField: string) {
		tree.forEach((node) => {
			node.id = node[idField]
			node.value = {}
			node.value.name = node[nameField]
			if (node.children) {
				loopTree(node.children, idField, nameField)
			}
		})
	}

	const { data: orgList, loading } = useRequest<API.ORGANIZATION[], unknown[]>(
		async () => {
			const treeData = get(await getOrganizationList(), 'data', [])
			loopTree<API.ORGANIZATION>(treeData, 'org_id', 'org_name')
			return treeData
		});

	return (
		<PageContainer header={{ title: null }}>
			<Card loading={loading}>
				<OrganizationGraph data={orgList?.[0] ?? {}} behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']} />
			</Card>
		</PageContainer>
	)
}

export default Structure