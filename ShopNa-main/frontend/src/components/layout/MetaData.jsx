import Helmet from "react-helmet"

const MetaData = ({title}) => {
  return (
    <>
    <Helmet>
        <title>
            {`${title} - Shop Na`}
        </title>
    </Helmet>
    </>
  )
}

export default MetaData