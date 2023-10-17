import { useState, ChangeEvent } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, Typography, Button, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAuth } from '../auth';

const cardStyle = {
  maxWidth: 400,
  margin: '0 auto',
  padding: '20px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
};

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { loading, getToken, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError(null);
    setUploading(true);
    setApiError(null);

    const formData = new FormData();
    formData.append('pdf_file', selectedFile);

    try {
      const token = await getToken();
      if (!token) {
        setError('Authorization token not available.');
        setUploading(false);
        return;
      }
      const url = process.env.NEXT_PUBLIC_API_HOST + '/upload_file';
      fetch(url, {
  method: 'POST',
  body: formData,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (response.ok) {
      console.log('File uploaded successfully');
      setUploading(false);
      setSelectedFile(null);
    } else {
      console.log("check ", response);
      console.error('Error uploading file:', response.statusText);

      // Display the API response error if available
      return response.json().then(text => {setApiError(text['error']);});
    }
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });


        setUploading(false);
      
    } catch (err) {
      setError(`An error occurred while uploading the file: ${err}`);
      console.error('Error uploading file:', err);
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            File Upload
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {apiError && <Alert severity="error">{apiError}</Alert>}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {selectedFile && (
            <Typography variant="body1" gutterBottom>
              Selected File: {selectedFile.name}
            </Typography>
          )}
          <Box display="flex" justifyContent="space-between">
            <label htmlFor="fileInput">
              <Button
                variant="contained"
                component="span"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </label>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default FileUpload;
