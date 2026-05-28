import React, { useState } from 'react';
import { Layout, Tabs, Table, Progress, Card, Button, List, Tag, Modal, message } from 'antd';
import { UserOutlined, BookOutlined, ReloadOutlined } from '@ant-design/icons';

const { Content } = Layout;

// Mock Data
const students = [
  { key: '1', name: 'أحمد محمد', progress: 75, weakSkills: ['الكسور', 'الضرب'], schedule: 'الأحد - الثلاثاء' },
  { key: '2', name: 'سارة علي', progress: 90, weakSkills: ['القسمة المطولة'], schedule: 'الاثنين - الأربعاء' },
];

const StudentsTab = () => {
  const [data, setData] = useState(students);

  const handleReset = (record: any) => {
    Modal.confirm({
      title: 'هل أنت متأكد؟',
      content: `سيتم إعادة تعيين تقدم الطالب ${record.name}`,
      onOk: () => {
        message.success('تم إعادة تعيين الطالب بنجاح');
      },
    });
  };

  const columns = [
    { title: 'اسم الطالب', dataIndex: 'name', key: 'name' },
    { 
      title: 'التقدم', 
      dataIndex: 'progress', 
      key: 'progress',
      render: (val: number) => <Progress percent={val} size="small" />
    },
    { 
      title: 'المهارات الضعيفة', 
      dataIndex: 'weakSkills', 
      key: 'weakSkills',
      render: (skills: string[]) => skills.map(s => <Tag color="red" key={s}>{s}</Tag>)
    },
    { title: 'جدول المراجعة', dataIndex: 'schedule', key: 'schedule' },
    {
      title: 'إجراءات',
      key: 'action',
      render: (_: any, record: any) => (
        <Button icon={<ReloadOutlined />} onClick={() => handleReset(record)} danger>
          إعادة تعيين
        </Button>
      ),
    },
  ];

  return (
    <Card title="قائمة الطلاب ومتابعة الأداء">
      <Table dataSource={data} columns={columns} />
    </Card>
  );
};

const VideosTab = () => <div>محتوى الفيديوهات</div>;

export default function AdminDashboard() {
  return (
    <Layout style={{ padding: '24px', background: '#fff' }}>
      <Content>
        <h1>لوحة تحكم الإدارة</h1>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span><UserOutlined /> الطلاب</span>} key="1">
            <StudentsTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><BookOutlined /> الفيديوهات</span>} key="2">
            <VideosTab />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
