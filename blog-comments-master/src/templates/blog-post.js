import React, {useState} from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Comments from "../components/Comments"
import {firestore} from "../../../firebase.js"

export default ({ data }) => {
  const post = data.markdownRemark
  const [comments, setComments] = useState([{name: "Elon", content: "Hello, I also went there.", pId: null, time: null}])
  const slug = post.fields.slug.substring(1, post.fields.slug.length - 1)

  return (
    <Layout>
      <div className="container">
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Comments comments={comments} slug={slug} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`
useEffect(() => {
    const cleanUp = firestore
      .doc(`comments/${slug}`)
      .collection("comments")
      .onSnapshot(snapshot => {
        const posts = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() }
        })
        setComments(posts)
      })
    return () => cleanUp()
  }, [slug])