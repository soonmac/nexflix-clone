import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { IMovie } from "../api";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { makeImagePath } from "../Routes/Utils";
import Modal from "./Modal";
import TvModal from "./TvModal";

const Wrapper = styled.article`
  background-color: black;
  @media only screen and (max-width: 1024px) {
    font-size: 80%;
  }
  @media only screen and (max-width: 425px) {
    font-size: 60%;
  }
`;

const Slider = styled.div`
  height: 12.5em;
  position: relative;
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

const SlideBtn = styled.button`
  position: absolute;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 5;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 48px;
  padding: 1rem;
  opacity: 0;
  transition: 0.3s;
  &:hover {
    opacity: 1;
  }
  @media only screen and (max-width: 1024px) {
    display: none;
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

export interface ISlider {
  data: any;
  category?: string;
  url?: string;
  type?: string;
}
function Slide({ data, category, type, url }: ISlider) {
  const history = useHistory();
  const rowVariants = {
    hidden: (back: boolean) => ({
      x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
    }),
    visible: {
      x: 0,
    },
    exit: (back: boolean) => ({
      x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
  };
// console.log(data);
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
  // ???????????? ?????? state
  const [offset, setOffset] = useState(6);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const increaseIndex = () => {
    if (data) {
      //???????????? ?????????????????? ??????????????? ?????? ??????
      if (leaving) return;
      // ?????? ???????????? ????????? leaving??? true??? ?????? ?????????
      // setIndex ???????????? ?????? ?????? ??????
      //????????? ?????? true ????????? ??????;; ?????? onExitComplete prop?????? ?????????
      setLeaving(true);
      setBack(false);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setBack(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/${url}/${type}/${movieId}`);
  };
  

  //slide drag

  const swipeConfidenceThreshold = 1000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  //mobile
  const [isMobile, setIsMobile] = useState(false);
  // ???????????? ???????????? ???????????? ?????? ????????? ?????? ????????? ?????? ??????
  const resizingHandler = () => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true);
      setOffset(4);
    } else {
      setIsMobile(false);
      setOffset(6);
    }
  };
  // ?????? ??? ?????? 1024??? ????????? ??????
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true);
      setOffset(4);
    }

    window.addEventListener("resize", resizingHandler);
    return () => {
      // ????????? ????????? ????????? ?????? removeEvent
      window.removeEventListener("resize", resizingHandler);
    };
  }, []);
  const bigMovieMatch =  useRouteMatch<{ movieId: string }>(
    `/${url}/${type}/:movieId`
  );

  return (
    <Wrapper>
      {data && (
        <>
          <Slider>
            <SlideBtn style={{ left: 0 }} onClick={decreaseIndex}>
              <FaAngleLeft />
            </SlideBtn>
            <SlideBtn style={{ right: 0 }} onClick={increaseIndex}>
              <FaAngleRight />
            </SlideBtn>
            {/* onExitComplete: exit??? ????????? ??? ????????? */}
            {/* initial: false ?????? ???????????? ??? initial ?????????????????? ????????????*/}
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
                {...(isMobile && {
                  drag: "x",
                  dragElastic: 1,
                  dragConstraints: { left: 0, right: 0 },
                })}
                onDragEnd={(event, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    increaseIndex();
                  } else if (swipe > swipeConfidenceThreshold) {
                    decreaseIndex();
                  }
                }}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={`${movie.id}${category}${type}`}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      bigphoto={makeImagePath(movie.backdrop_path, "w400")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title || movie.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {bigMovieMatch && category==="movie" ? <Modal data={data} category="movie" type={type} url={url} /> : null}
          {bigMovieMatch && category==="tv" ? <TvModal data={data} category="tv" type={type} url={url} /> : null}
          {bigMovieMatch && category==="search" ? <Modal data={data} category="search" type={type} url={url} /> : null}
        </>
      )}
    </Wrapper>
  );
}
export default Slide;
