import {
  queryLatestAuditstatus,
  queryQrcode,
  queryToken,
  queryWechatLists,
  queryUndocodeaudit,
} from '@/api';
import { Button, Card, Form, message, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useList } from './data';
import { formatTimestamp } from '@/utils';

const Home = () => {
  const [wxList, setWxList] = useState<any[]>([]);
  const [token, setToken] = useState<string>('');
  const [result, setResult] = useState<any>();

  // form表单实例
  const [form] = Form.useForm();
  const appid = Form.useWatch('appid', form);
  const use = Form.useWatch('use', form);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const res = await queryWechatLists({
      type: 'SCRM_APP',
      page: 1,
    });
    if (res?.status === 0) {
      const list = res?.result?.list || [];
      setWxList(list);
    }
  };

  const handleChangeWx = () => {
    setToken('');
    setResult(undefined);
  };

  const handleChangeUse = () => {
    setResult(undefined);
  };

  // 筛选
  const filterOption = (input: any, option: any) => {
    return option?.children?.toLowerCase()?.includes(input?.toLowerCase());
  };

  const onFinish = async () => {
    const { appid, use } = await form.validateFields();
    let requestToken = token;
    if (!requestToken?.length) {
      const res = await queryToken({
        appid,
      });
      if (res?.status === 0) {
        setToken(res?.result?.accessToken || '');
        requestToken = res?.result?.accessToken || '';
      } else {
        message.error('请刷新');
      }
    }
    if (use === 'info') {
      const res = await queryLatestAuditstatus({ access_token: requestToken });
      if (res?.errcode === 0) {
        setResult(res);
      }
    }
    if (use === 'qrcode') {
      const response = await queryQrcode({ access_token: requestToken });
      const qrCodeUrl = URL.createObjectURL(response);
      setResult(qrCodeUrl);
    }
    if (use === 'revoke') {
      const res = await queryUndocodeaudit({ access_token: requestToken });
      if (res?.errcode === 0) {
        message.success('撤回成功~');
        setResult('撤回成功');
      }
    }
  };

  return (
    <div className="index-wrap">
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          name="appid"
          label="小程序"
          rules={[{ required: true, message: '请选择小程序' }]}
          extra={<div>{appid ? `appid：${appid}` : null}</div>}
        >
          <Select
            placeholder="请选择小程序"
            filterOption={filterOption}
            getPopupContainer={(triggerNode: any) => triggerNode?.parentElement}
            showSearch
            allowClear
            onChange={handleChangeWx}
          >
            {wxList.map((item) => {
              return (
                <Select.Option key={item.wechatAppId} value={item.wechatAppId}>
                  {item.wechatAppName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="use"
          label="功能"
          rules={[{ required: true, message: '请选择功能' }]}
        >
          <Select
            placeholder="请选择功能"
            showSearch
            allowClear
            onChange={handleChangeUse}
          >
            {useList.map((item) => {
              return (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.use !== currentValues.use
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('use') === 'revoke' ? (
              <Form.Item label={null}>
                <Popconfirm
                  title="撤回审核"
                  description="确认撤回审核吗"
                  okText="是的"
                  cancelText="不撤回，我点错了"
                  onConfirm={onFinish}
                >
                  <Button danger>撤回</Button>
                </Popconfirm>
              </Form.Item>
            ) : (
              <Form.Item label={null}>
                <Button type="primary" onClick={onFinish}>
                  提交
                </Button>
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
      <>
        {result && (
          <Card title="结果" style={{ width: 800 }}>
            {use === 'info' && result && (
              <>
                <p>最新的审核 ID: {result.auditid}</p>
                {result.status === 0 && <p>审核状态: 审核成功</p>}
                {result.status === 1 && <p>审核状态: 审核被拒绝</p>}
                {result.status === 2 && <p>审核状态: 审核中</p>}
                {result.status === 3 && <p>审核状态: 已撤回</p>}
                {result.status === 4 && <p>审核状态: 审核延后</p>}
                {result.reason && <p>拒绝原因: {result.reason}</p>}
                {result.ScreenShot && <p>截图示例: {result.ScreenShot}</p>}
                {result.user_desc && <p>版本描述: {result.user_desc}</p>}
                {result.user_version && <p>审核版本: {result.user_version}</p>}
                {result.submit_audit_time && (
                  <p>
                    提交审核的时间: {formatTimestamp(result.submit_audit_time*1000)}
                  </p>
                )}
              </>
            )}
            {use === 'qrcode' && <img src={result} />}
            {use === 'revoke' && <p color="red">{result}</p>}
          </Card>
        )}
      </>
    </div>
  );
};

export default Home;
