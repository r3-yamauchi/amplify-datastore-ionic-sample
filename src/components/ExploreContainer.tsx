import React, { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Post, PostStatus } from '../models';
import './ExploreContainer.css';

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

  return (
    <div className="container">
      <strong>Power Of Amplify DataStore</strong>
      <p>Start with Ionic</p>
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
