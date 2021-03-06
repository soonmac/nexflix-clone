import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { favState } from "../atom";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../Routes/Utils";
import Modal from "./Modal";
import { ISlider } from "./Slide";
import FavModal from "./FavModal";

const Wrapper = styled.article`
  background-color: black;
  @media only screen and (max-width: 1024px) {
    font-size: 80%;
  }
  @media only screen and (max-width: 425px) {
    font-size: 60%;
  }
`;
const List = styled.div`
  background-color: black;
  height: 12.5em;
  position: relative;
  margin-top: 10rem;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
const Box = styled(motion.div)<{ bigphoto: string }>`
  background-color: gray;
  background-image: url(${(props) => props.bigphoto});
  background-size: cover;
  background-position: center center;
  font-size: 66px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.bgLighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
`;
// animations
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};
function FavList() {
  const history = useHistory();
  const favourites = useRecoilValue(favState);
  const onBoxClicked = (
    type: string | undefined,
    category: string | undefined,
    id: number | undefined
  ) => {
    history.push(`/${category}/${type}/${id}`);
    // history.push(`/my-list/${category}/${id}`);
  };
  const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -40,
      transition: {
        delay: 0.3,
      },
    },
  };

  return (
    <Wrapper>
      <List>
        <Row>
          {favourites !== []
            ? favourites?.map((movie) => (
                <Box
                  layoutId={`${movie.id}${movie.category}`}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() =>
                    onBoxClicked(movie.type, movie.category, movie.id)
                  }
                  variants={boxVariants}
                  bigphoto={makeImagePath(movie.backdrop_path, "w400")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title || movie.name}</h4>
                  </Info>
                  <AnimatePresence>
                    <FavModal
                      data={movie}
                      type={movie.category} //movie or tv
                      category="my-list"
                      url={movie.category === "movie" ? "movie" : "tv"}
                    />
                  </AnimatePresence>
                </Box>
              ))
            : "Loading..."}
        </Row>
      </List>
    </Wrapper>
  );
}
export default FavList;
