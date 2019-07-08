import React, { PureComponent } from 'react';
import { List, Icon, Tag,Avatar } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import marked  from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import router from 'umi/router';
import styles from './Articles.less';

@connect(({ appIndex ,user}) => ({
  appIndex,
  userInfo:user.userInfo.data
}))
class Center extends PureComponent {
  componentDidMount(){
    // marked初始化--转化html
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code) {
        return hljs.highlightAuto(code).value;
      },
      sanitize: false,
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: true,
      smartLists: true,
      smartypants: true,
      xhtml: false
    });
  }
  handleClick = record =>{
    router.push(`/appIndex/article/projects/${record.id}`);
  }
  marked_translate(code){
    const codeString = code.substring(0,100);
    const count = marked(codeString);
    return <div dangerouslySetInnerHTML={{ __html: count }} />
  }
  render() {
    const {
      appIndex: { data:{list} },
      userInfo,
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={list}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <IconText type="star-o" text={item.views} />,
              <IconText type="like-o" text={item.likes} />,
              <IconText type="message" text={item.comments} />,
            ]}
            extra={<div className={styles.listItemExtra} />}
          >
            <List.Item.Meta
              title={
                <span className={styles.listItemMetaTitle}  onClick={() => this.handleClick(item)}>
                  {item.title}
                </span>
              }
              description={
                <span>
                  {
                    item.keyword.split(",").map(tag=><Tag color="blue" key={tag}>{tag}</Tag>)
                  }
                </span>
              }
            />
            <div className={styles.listContent}>
              <div className={styles.description}>{this.marked_translate(item.content)}</div>
              <div className={styles.extra}>
                {userInfo?<Avatar src={userInfo.avatar} size="small" />:null}
                <a href={item.href}>{item.owner}</a> 发布于
                <em>{moment(item.updatedAt).format('YYYY-MM-DD HH:mm')}</em>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  }
}

export default Center;
