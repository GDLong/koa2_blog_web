import React, { PureComponent,Fragment } from 'react';
import { List, Card,BackTop ,Spin,Avatar,Row, Col ,Icon,Button,Divider,Comment,Input,Form, message,Modal } from 'antd';
import moment from 'moment';
import marked  from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import { connect } from 'dva';
import AvatarList from '@/components/AvatarList';
import ExampleComment from './exampleComment';
import styles from './Projects.less';
const { TextArea } = Input;
@connect(({ appIndex,loading }) => ({
  appIndex,
  loading: loading.effects['appIndex/fetchArticle'],
}))
class Center extends PureComponent {
  constructor(){
    super()
    this.state={
      textValue:"",
      replyValue:"",
      replyVisible:false,
      replyData:{},
      comments:[]
    }
  }
  componentDidMount(){
    const { dispatch,match } = this.props;
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
    //
    if(match.params.key && parseInt(match.params.key)){
      // 文章详情
      dispatch({
        type: 'appIndex/fetchArticle',
        payload:match.params.key
      });
      // 评论详情
      dispatch({
        type: 'appIndex/fetchReply',
        payload:{articleId:match.params.key},
        callback:(res)=>{
          const trans = this.transReply(res.data);
          this.setState({
            comments:trans
          })
        }
      });

    }else{
      alert("文章ID报错")
    }
  }
  transReply=(data)=>{
    const parents = data.filter(item=>item.commentId == 0 || item.commentId == null)
    const children = data.filter(item=>item.commentId !== 0 || item.commentId !== null)

    let translator = (parents,children)=>{
      parents.forEach(parent => {
        // 遍历子节点数据
        children.forEach((child,index) => {
          // 如果找到父子对应关系
          if(child.commentId == parent.id){
            let temp = JSON.parse(JSON.stringify(children))
            temp.splice(index,1)//当前子节点从拷贝元素中删除
            translator([child],temp)
            //把找到子节点放入父节点的children属性中
            typeof parent.children !== 'undefined' ? parent.children.push(child) : parent.children = [child]
          }
        })
      });
    }
    translator(parents, children)
    //返回最终的结果
    return parents
  }
  // 留言框双向绑定
  handleChange=(event)=>{
    this.setState({
      textValue:event.target.value
    })
  }
  handleReplyChange=(event)=>{
    this.setState({
      replyValue:event.target.value
    })
  }
  // 提交留言
  postComment=()=>{
    const {dispatch,match} = this.props;
    let {textValue} = this.state;
    textValue = textValue.replace(/^\s+|\s+$/g,"");
    if(textValue.length < 5){
      message.warning("评论不能少于5个字！")
      return
    }
    const data = {
      articleId:match.params.key,
      content:textValue,
      commentId:null
    }
    dispatch({
      type:"appIndex/fetchPostComment",
      payload:data,
      callback:(res)=>{
        if(res.code == 200){
          message.success(res.msg)
          dispatch({
            type: 'appIndex/fetchReply',
            payload:{articleId:match.params.key},
            callback:(res)=>{
              const trans = this.transReply(res.data);
              this.setState({
                textValue:"",
                comments:trans
              })
            }
          });
          return
        }
        message.error(res.msg)
      }
    })
  }
  // 留言版
  commentNodes = comments =>{
    return comments.map(comment=>{
      if(comment.children){
        return (
          <ExampleComment data={comment} key={comment.id} handleReply={this.handleReply}>
            {this.commentNodes(comment.children)}
          </ExampleComment>
        )
      }
      return <ExampleComment data={comment} key={comment.id} handleReply={this.handleReply}/>
    })
  }
  // 回复某个用的的留言
  handleReply=(data)=>{
    this.setState({
      replyVisible:true,
      replyData:data
    })
  }
  handleCancel=()=>{
    this.setState({
      replyVisible:false,
      replyData:{}
    })
  }
  handleOk=()=>{
    const {dispatch} = this.props;
    let {replyValue,replyData} = this.state;
    replyValue = replyValue.replace(/^\s+|\s+$/g,"");
    if(replyValue.length < 5){
      message.warning("评论不能少于5个字！")
      return
    }
    const data = {
      articleId:replyData.articleId,
      content:replyValue,
      commentId:replyData.id
    }

    dispatch({
      type:"appIndex/fetchPostComment",
      payload:data,
      callback:(res)=>{
        if(res.code == 200){
          message.success(res.msg)
          this.setState({
            replyVisible:false,
          })
          dispatch({
            type: 'appIndex/fetchReply',
            payload:{articleId:replyData.articleId},
            callback:(res)=>{
              const trans = this.transReply(res.data);
              this.setState({
                replyValue:"",
                comments:trans
              })
            }
          });
          return
        }
        message.error(res.msg)
      }
    })
  }
  render() {
    const {
      appIndex: { article },
      loading
    } = this.props;
    const {comments,replyVisible,replyData,replyValue,textValue} = this.state;

    // 文章翻译
    const MakeDownTransForm = ({domString})=>{
      const {data:{content}} = domString;
      const count = marked(content);
      return <div className={styles.articleDetail} dangerouslySetInnerHTML={{ __html: count }} />
    }

    return (
      <Spin spinning={loading}>
        <div>{
          article && article.code==200 && !loading ?
            <Fragment>
              <div className={styles.listContent}>
                <div className={styles.title}>{article.data.title}</div>
                <Row type="flex">
                  <Col span={12}>
                    <div className={styles.extra}>
                      <a href={article.data.href}>{article.data.owner}</a> 发布于
                      <em>{moment(article.data.updatedAt).format('YYYY-MM-DD HH:mm')}</em>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.extraR}>
                      <Icon type="star" /><span>0</span>
                      <Divider type="vertical" />
                      <Icon type="like" /><span>0</span>
                      <Divider type="vertical" />
                      <Icon type="message" /><span>0</span>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* 翻译的文章 */}
              <MakeDownTransForm domString={article}/>
              {/* 发表留言的输入框 */}
              <div className="comment-reply">
                <Comment
                  avatar={
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      alt="Han Solo"
                    />
                  }
                  content={
                    <Fragment>
                      <Form.Item>
                        <TextArea rows={4} value={textValue}  onChange={this.handleChange} placeholder="评论不能少于5个字！"/>
                      </Form.Item>
                      <Form.Item>
                        <Button htmlType="submit" type="primary" onClick={this.postComment}>
                          评论
                        </Button>
                      </Form.Item>
                    </Fragment>
                  }
                />
              </div>
              {/* 留言内容 */}
             {this.commentNodes(comments)}
            </Fragment>
          :null}
          <Modal
            title={"回复："+replyData.commentId}
            visible={replyVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <TextArea rows={4} value={replyValue} onChange={this.handleReplyChange} placeholder="评论不能少于5个字！"/>
          </Modal>
          <BackTop />
        </div>
      </Spin>
    );
  }
}

export default Center;
