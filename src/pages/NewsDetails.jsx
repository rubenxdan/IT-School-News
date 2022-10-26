import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useFetch } from "../utils/hooks/useFetch";
import { getNewsDetailsEndpoint } from "../api/endpoints";
import { getNewsDetails } from "../api/adaptors";
import Button from "react-bootstrap/Button";
import styles from "./NewsDetails.module.css";
import { getFormattedDate } from "../utils/date";
import { addToFavorites } from "../store/Favorites/actions";
import { FavoritesContext } from "../store/Favorites/context";

function NewsDetails() {
  const [alert, setAlert] = useState(false);
  const [isInList, setIsInList] = useState(false);

  // Extragem functia care modifica state-ul global.
  const { favoritesState, favoritesDispatch } = useContext(FavoritesContext);
  // Extragem parametrul venit din URL.
  let { newsId } = useParams();
  // Vrem ca id-ul extras din URL sa contina /-urile, asa ca il decodam.
  newsId = decodeURIComponent(newsId);
  // Generam endpointul pentru detaliile stirii.
  const newsDetailsEndpoint = getNewsDetailsEndpoint(newsId);
  // Cerem datele de la server.
  const newsDetails = useFetch(newsDetailsEndpoint);
  // Adaptam datele de la server la datele de care au nevoie componentele de react.
  const adaptedNewsDetails = getNewsDetails(newsDetails);

  // Extragem campurile de interes din datele adaptate.
  const { title, description, image, date, author, content, thumbnail } =
    adaptedNewsDetails;
  // Formatam data.
  const formattedDate = getFormattedDate(date);

  function handleAddToFavorites(product) {
    const isInList = favoritesState.products.find((product) => {
      return product.id === newsId;
    });
    setIsInList(isInList);
    // Apelam actiunea de adaugare la favorite.
    const actionResult = addToFavorites(product);
    // Trimitem rezultatul actiunii catre reducer.
    favoritesDispatch(actionResult);
  }

  function handleAddToFavoriteAlert() {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }

  // console.log(isInList);

  return (
    <Layout>
      <Container className={`${styles.newsDetails} my-5`}>
        <Row className="d-flex justify-content-center">
          <Col xs={12} lg={8}>
            <h1 className="pt-3 mb-5">{title}</h1>
            <p className="fw-bold">{description}</p>
            <div
              // De la The Guardian imaginea ne vine sub forma de tag-uri de html.
              // Pentru a afisa html pe ecran, avem nevoie de prop-ul dangerouslySetInnerHTML.
              dangerouslySetInnerHTML={{ __html: image }}
              className="mb-4"
            ></div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="fw-bold">
                <p>{author}</p>
                <p className="mb-0">{formattedDate}</p>
              </div>
              <Button
                onClick={() => {
                  // Construim payload-ul actiunii si apelam functia care trimite actiunea catre reducer.
                  handleAddToFavorites({
                    id: newsId,
                    thumbnail,
                    title,
                    description,
                    hasCloseButton: true,
                  });
                  handleAddToFavoriteAlert();
                }}
              >
                Adaugă la favorite
              </Button>
            </div>
            {/* De la The Guardian continutul ne vine sub forma de tag-uri de html. */}
            {/* Pentru a afisa html pe ecran, avem nevoie de prop-ul dangerouslySetInnerHTML. */}
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </Col>
        </Row>
      </Container>
      {isInList ? (
        <div
          className={alert ? `${styles.show}` : `${styles.hide}`}
          style={{ backgroundColor: "#e8921a" }}
        >
          <div className={`${styles.message}`}>Stirea exista la favorite!</div>
        </div>
      ) : (
        <div
          className={alert ? `${styles.show}` : `${styles.hide}`}
          style={{ backgroundColor: "#00F593" }}
        >
          <div className={`${styles.message}`}>
            Stirea a fost adaugata la favorite!
          </div>
        </div>
      )}
    </Layout>
  );
}

export default NewsDetails;
