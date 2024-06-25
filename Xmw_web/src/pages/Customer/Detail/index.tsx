/* eslint-disable max-len */
import { Comment } from '@ant-design/compatible'
import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams, useRequest } from '@umijs/max';
import { Avatar, Button, Card, Flex, Form, List, Space, Input } from 'antd';
import { map } from 'lodash-es'
import { FC, useMemo, useState } from 'react';

import { createCustomerComment, getCustomerById, getCustomerComment } from '@/services/customer';
import { formatResponse } from '@/utils';

interface CommentItem {
  cn_name: string;
  avatar_url: string;
  content: React.ReactNode;
  created_time: string;
}

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}


const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <>
    <Form.Item>
      <Input.TextArea placeholder='添加回访记录' rows={2} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        提交
      </Button>
    </Form.Item>
  </>
);


const SHOW_FIELD_MAP: Record<string, { [key: string]: any }> = {
  user_name: {
    title: '姓名',

  },
  email: {
    title: '邮箱',
  },
  phone: {
    title: '联系方式',
  },
  address: {
    title: '地址',
  },
}

const CustomerDetail: FC = () => {
  const { id = '' } = useParams();
  const [title, setTitle] = useState('客户详情');

  const [commentText, setCommentText] = useState<string>('');

  const { data: comments = [], refresh: refreshComment } = useRequest(async () => formatResponse(await getCustomerComment(id)));

  const { initialState } = useModel('@@initialState');

  const { data, loading } = useRequest<{ data: any }>(() => getCustomerById(id), {
    formatResult(resp) {
      return map(resp.data, (value: string, key: string) => {
        const info = {
          key,
          title: SHOW_FIELD_MAP[key]?.title,
          content: value,
          avatar: key === 'user_name' && resp.data?.avatar_url,
        };
        if (key === 'user_name') {
          setTitle(value);
          info.avatar = resp.data?.avatar_url;
        }
        return info;
      })
    },
  });

  const list = useMemo(() => {
    return data?.filter((item: { title: string; }) => item.title)
  }, [data]);

  const CommentList = ({ comments }: { comments: CommentItem[] }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={props => <Comment content={props.content} avatar={props.avatar_url} author={props.cn_name} datetime={props.created_time} />}
    />
  );

  return <PageContainer header={{ title: title }}>
    <Flex gap={24}>
      <div>
        <Card
          loading={loading}
          bordered
          style={{ width: 320 }}
          title="基本资料"
          extra={<Button type="text"
          >Edit</Button>}>
          <List
            dataSource={list}
            renderItem={(item: any) => {
              return <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {
                    item.key === 'user_name' &&
                    <Avatar shape="square" size={64} src={item.avatar} icon={<UserOutlined />} />
                  }
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.title}</a>}
                    description={item.content}
                  />
                </Space>
              </List.Item>
            }}
          />
        </Card>
      </div>
      <div style={{
        flex: 1,
      }}>
        <Card
          loading={loading}
          title="回访跟踪"
        >
          <div>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
              avatar={<Avatar src={initialState?.CurrentUser?.avatar_url} alt="Han Solo" />}
              content={
                <Editor
                  onChange={(e) => setCommentText(e.target.value)}
                  onSubmit={async () => {
                    await createCustomerComment({
                      content: commentText,
                      from_uid: initialState?.CurrentUser?.user_id,
                      customer_id: id,
                    });
                    refreshComment();
                    setCommentText('');
                  }}
                  submitting={false}
                  value={commentText}
                />
              }
            />
          </div>
        </Card>
      </div>
    </Flex>

  </PageContainer>
};

export default CustomerDetail;
