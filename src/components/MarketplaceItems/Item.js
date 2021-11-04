// This component needs: key, name, desc, tags, location, time, price
import React from "react"
// LIBS
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Mana } from "decentraland-ui/dist/components/Mana/Mana"

// CSS
import classes from "./Item.module.css"

export default function Item(props) {
  // Fetch Image from API
  // const [imageURL, setImageURL] = useState()
  // useEffect(() => {
  //   axios
  //     .post(
  //       "HERE PUT LINK",
  //       { imageID: props.imageID }
  //     )
  //     .then(function (response) {
  //       console.log(response.data.body)
  //       setImageURL(response.data.body)
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //     })
  // }, [])

  const assetLink = "/"
  return (
    // <Link href={assetLink}>
    <div className={classes.EventCardPrincipal}>
      <article className={classes.EventCardArticle}>
        <a className={classes.EventCardA}>
          <div className={classes.EventCardImageWrapper}>
            <div className={classes.EventCardImageWrapper2}>
              <div className={classes.EventCardImageWrapper3}>
                <div className={classes.EventCardImageWrapper4}>
                  {/* {imageURL ? (
                    <img src={imageURL} className={classes.EventCardImage} />
                  ) : (
                    <Loader active size="massive" />
                  )} */}
                  <Loader active size="massive" />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.EventCardDescriptionWrapper}>
            <Mana
              style={{
                "margin-bottom": 0,
                "font-size": "x-large",
                color: "black",
                padding: "20px",
              }}
            >
              {props.price}
            </Mana>
            <Button primary>Buy</Button>
            {/* <div className={classes.EventCardDescriptionPart1}>
              <div className={classes.EventCardDescriptionPart1Div1}>
                <div className={classes.EventCardDescriptionPart1Div1Sub1}>
                  <b>{props.name}</b>
                </div>
                <div className={classes.EventCardDescriptionPart1Div1Sub2}>
                  {props.desc}
                </div>
              </div>
              <div className={classes.EventCardDescriptionPart1Div2}>
                <div className={classes.EventCardDescriptionPrice}>
                  <Button>Like</Button>
                </div>
                <div className={classes.EventCardDescriptionPriceNumberWrapper}>
                  <div className={classes.EventCardDescriptionPriceNumber}>
                    <Button>Dislike</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.EventCardDescriptionPart2}>
            </div> */}
          </div>
        </a>
      </article>
    </div>
    // </Link>
  )
}
