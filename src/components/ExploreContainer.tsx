import React, { useEffect, useState } from 'react';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Post, PostStatus } from '../models';
import './ExploreContainer.css';

function onCreate() {
  DataStore.save(
    new Post({
      title: `New title ${Date.now()}`,
      rating: (function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      })(1, 7),
      status: PostStatus.ACTIVE
    })
  );
}

function onDeleteAll() {
  DataStore.delete(Post, Predicates.ALL);
}

async function onQuery() {
  const posts = await DataStore.query(Post, c => c.rating('gt', 4));
  console.log(posts);
}

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {

  const [form, updateForm] = useState({ title: '', rating: 0 });

  async function create() {
    const postData = {...form, status: PostStatus.INACTIVE};
    await DataStore.save(
      new Post(postData)
    );
    console.log('successfully created new post');
    updateForm({ title: '', rating: 0 });
  }

  useEffect(() => {
    const subscription = DataStore.observe(Post).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <div className="container">
      <strong>Power Of Amplify DataStore</strong>
      <p>Start with Ionic</p>
      <input type="button" value="NEW" onClick={onCreate} />
      <input type="button" value="DELETE ALL" onClick={onDeleteAll} />
      <input type="button" value="QUERY rating > 4" onClick={onQuery} />

      <input
          value={form.title}
          placeholder="title"
          onChange={e => updateForm({ ...form, 'title': e.target.value })}
        />
        <input
          value={form.rating}
          placeholder="rating"
          onChange={e => updateForm({ ...form, 'rating': parseInt(e.target.value) })}
        />
        <button onClick={create}>Create Post</button>      
    </div>
  );
};

export default ExploreContainer;
