import './style.css';
import { Component } from 'react';
import { loadPosts } from '../../utils/load-posts';
import { Posts } from '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

class Home extends Component{
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    searchValue: '',

  };

  async componentDidMount(){
    await this.loadPosts();
  }
  
  loadPosts = async()=>{
    const { page, postsPerPage } = this.state;

    const postsAndPhotos = await loadPosts();

    this.setState({ 
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,

    });
  }

  loadMorePosts = () => {
    const {
      page, 
      postsPerPage,
      allPosts, 
      posts
    } = this.state;

    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, (nextPage + postsPerPage))
    
    posts.push(...nextPosts)

    this.setState({ posts, page: nextPage})
  }


  componentDidUpdate(){}
  componentWillUnmount(){}

  handleChange = (e)=>{
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  render(){
    const { posts, page, postsPerPage, allPosts }  = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!this.state.searchValue ? 
      allPosts.filter(post =>{
        return post.title.toLowerCase().includes(this.state.searchValue.toLowerCase());
      }): posts;


    return (
        <section className='container'>
          <div className='search-container'>
            {
              !!this.state.searchValue &&(
                <h1>Search Value: {this.state.searchValue}</h1>
              )
            }

            <TextInput
              searchValue={this.state.searchValue}
              handleChange={this.handleChange} 
            />

          </div>
          
          {
            filteredPosts.length > 0 && (
              <Posts posts={filteredPosts}/>
            )
          }
          
          {
            filteredPosts.length === 0 && (
              <p>Não existe posts</p>
            )
          }


          <div className='button-container'>
            {
              !this.state.searchValue &&(
                <Button 
                  onClick={this.loadMorePosts} 
                  text="Load more posts"
                  disabled={noMorePosts} 
                />
              )
            }
           
          </div>

        </section>
    )
  }
}
export default Home;
