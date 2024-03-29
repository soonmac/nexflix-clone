import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  keyword: string;
}

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100vw;
  top: 0;
  background-color: ${(props) => props.theme.bgLighter};
  padding: 20px 60px;
  color: ${(props) => props.theme.text};
  text-shadow: black 1px 1px 10px;
  z-index: 9;
  @media only screen and (max-width: 768px) {
    padding: 20px 40px;
  }
  @media only screen and (max-width: 625px) {
    padding: 20px;
    font-size:80%;
  }
  @media only screen and (max-width: 425px) {
    padding: 20px;
    font-size:70%;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 10px;
    stroke: white;
  }
  @media only screen and (max-width: 425px) {
    width: 70px;
    margin-right: 16px;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.textDarker};
  transition: color 0.3s ease-in-out;
  position: relative;
  &:hover {
    color: ${(props) => props.theme.textDarker};
  }
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.textDarker};
  }
`;

const Search = styled.form`
  color: white;
  svg {
    height: 25px;
    position: absolute;
    z-index: 9;
  }
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-right: 16px;
`;
const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 5;
  border: 1px solid ${(props) => props.theme.textDarker};
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const logoVariants = {
  normal: {
    fillOpacity: 0,
  },
  active: {
    // 배열로 정하면 순서대로 진행됨
    fillOpacity: 1,
  },
};

function Header() {
  // 검색창 state
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimaion = useAnimation();
  //nav 관련
  const NavAnimaion = useAnimation();
  const { scrollY } = useViewportScroll();
  // nav의 높이 구하기
  const [navHeight, setNavHeight] = useState<any>(0);
  const navRef = useRef<HTMLDivElement>(null);

  //스타일 변수로 저장
  const navVariants = {
    top: {
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    scroll: {
      backgroundColor: "rgba(0, 0, 0, 1)",
    },
  };

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimaion.start({
        scaleX: 0,
      });
    } else {
      // open animation
      inputAnimaion.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight);
    scrollY.onChange(() => {
      if (scrollY.get() > navHeight) {
        NavAnimaion.start("scroll");
      } else {
        NavAnimaion.start("top");
      }
    });
  }, []);
  // useRouteMatch: 해당 주소가 맞으면 object 반환 아니면 null
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const favMatch = useRouteMatch("/my-list");
  // 입력폼
  const history = useHistory();
  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
  };
  return (
    <Nav
      variants={navVariants}
      ref={navRef}
      animate={NavAnimaion}
      initial={"top"}
    >
      <Col>
        <Logo
          // svg 애니메이션
          variants={logoVariants}
          whileHover="active"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          {/* motion 쓸거면 path를 motion.path로 바꿔야함; */}
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>
            <Link to="/">
              {/* homeMatch가 있고, ixExact가 true면 Circle 표시 */}홈{" "}
              {homeMatch?.isExact && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/tv">
              시리즈 {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/my-list">
              내가 찜한 콘텐츠 {favMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -240 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimaion}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="영화, 시리즈 제목"
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
