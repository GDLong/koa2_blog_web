import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ loading, appIndex,user }) => ({
  appIndex,
  listLoading: loading.effects['appIndex/fetchList'],
  currentUser: user.userInfo.data,
  currentUserLoading: loading.effects['user/fetchUserInfo'],
  articleLoading: loading.effects['appIndex'],
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    project:[
      {
        id:1,
        title: "掘金",
        explain: "只有高手分享的中文技术社区",
        logo: "http://www.alloyteam.com/nav/static/images/gold-favicon.png",
        href: "#",
      },
      {
        id:2,
        title: "GitHub",
        explain: "面向开源及私有软件项目的git托管平台",
        logo: "http://www.alloyteam.com/nav/static/images/github-favicon.png",
        href: "#",
      }
    ]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appIndex/fetchList',
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  render() {
    const { newTags, inputVisible,project } = this.state;
    const {
      listLoading,
      currentUserLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'articles',
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'applications',
        tab: (
          <span>
            应用 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];

    const {currentUser} = this.props
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      {currentUser.title}
                    </p>
                    <p>
                      <i className={styles.group} />
                      {currentUser.group}
                    </p>
                    <p>
                      <i className={styles.address} />
                      {currentUser.address}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUser.tags.split(',').map(item => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>链接</div>
                    <Row gutter={36}>
                      {project.map(item => (
                        <Col key={item.id} lg={24} xl={12}>
                          <Link to={item.href}>
                            <Avatar size="small" src={item.logo} />
                            {item.title}
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              // tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
