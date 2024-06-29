/* eslint-disable max-len */
import { Comment } from '@ant-design/compatible'
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Avatar, Button, Form, Input, List, Modal, ModalProps } from 'antd';
import { FC, useState } from 'react';

import { createCustomerComment, getCustomerComment } from '@/services/customer';
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


const CustomerDetail: FC<ModalProps & { initialValues: any }> = (props) => {
  const { initialValues } = props;

  const [commentText, setCommentText] = useState<string>('');

  const { data: comments = [], refresh: refreshComment } = useRequest(async () => formatResponse(await getCustomerComment(initialValues?.id)));

  const { initialState } = useModel('@@initialState');

  const CommentList = ({ comments }: { comments: CommentItem[] }) => (
    <List
      style={{ maxHeight: 300, overflow: 'scroll', width: '100%' }}
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment content={props.content} avatar={props.avatar_url} author={props.cn_name} datetime={props.created_time} />}
    />
  );

  return <Modal {...props} footer={null}>
    {comments.length > 0 && <CommentList comments={comments} />}
    <Comment
      style={{ width: '100%' }}
      avatar={<Avatar src={initialState?.CurrentUser?.avatar_url} alt="Han Solo" />}
      content={
        <Editor
          onChange={(e) => setCommentText(e.target.value)}
          onSubmit={async () => {
            await createCustomerComment({
              content: commentText,
              from_uid: initialState?.CurrentUser?.user_id,
              customer_id: initialValues?.id,
            });
            refreshComment();
            setCommentText('');
          }}
          submitting={false}
          value={commentText}
        />
      }
    />
  </Modal>
};

export default CustomerDetail;
