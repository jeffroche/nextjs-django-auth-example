from django.utils import timezone
from rest_framework import generics, response
from rest_framework.permissions import IsAuthenticated

from . import serializers
from django.http import JsonResponse
from django import forms
import tempfile 
from django.core.exceptions import ValidationError
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
from django.contrib.auth.decorators import login_required


class UploadPDFForm(forms.Form):
    pdf_file = forms.FileField(required=True)



def is_pdf(file):
    # Check if the uploaded file is a PDF using the 'magic' library
    
    try:
        print("returning file after validatiom")
        response = PdfReader(file)
        return response
    except PdfReadError as error:
        print("invalid PDF file")
        raise error
    except Exception as error:
        print("error occured while validating pdf",error)
        raise error
    

def extract_text_from_pdf(pdf_file_path):
    try:
        # Convert PDF to images using pdf2image
        pdf_images = convert_from_path(pdf_file_path)
        # Save each extracted image to the directory
        extracted_text = ""
        for i, page_image in enumerate(pdf_images):
            image_path = f'/app/images/page_{i + 1}.jpg'
            page_image.save(image_path, 'JPEG')
            print("Saving image for page", i)
            img = Image.open(image_path).convert('L')
            # Perform OCR on each page image
            custom_config = r'--oem 3 --textord_tablefind_recognize_tables --textord_force_make_prop_words'

            # Save the preprocessed image (optional)
            img.save('preprocessed_image.png')

            # Perform OCR with Tesseract
            # custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            custom_config = r'--oem 3  --psm 6 -c textord_tablefind_recognize_tables=1 -c textord_force_make_prop_words=1'

            # Use pytesseract to extract text with custom Tesseract configuration
            page_text= pytesseract.image_to_string(img, config=custom_config)

            extracted_text += page_text

        return extracted_text
    except Exception as error:
        print("Error raised while extracting text from pdf",error)
        raise error


def extract_pdf_data(request):
    try:
        if request.method == 'POST':
            print("request being processed",request.FILES)
            form = UploadPDFForm(request.POST, request.FILES)
            if form.is_valid():
                pdf_file = form.cleaned_data['pdf_file']
                print("pdf file returned",pdf_file)
            

                # Save the uploaded PDF to a temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                    for chunk in pdf_file.chunks():
                        temp_pdf.write(chunk)

                # Get the path to the saved PDF
                pdf_file_path = temp_pdf.name
                is_pdf(pdf_file_path)
                # Convert PDF to images
                pdf_images = extract_text_from_pdf(pdf_file_path)
                print("extracted text:",pdf_images)
                # print("pdf images",pdf_images)

                # Perform OCR to extract text from the PDF
                # extracted_text = extract_text_from_pdf(pdf_file)
                # print(extracted_text)
                # Now, you can parse the extracted_text to extract specific data like name, address, and income.
                # For demonstration purposes, let's assume you use simple string operations.
                name = "John Doe"  # Replace with actual parsing logic
                address = "123 Main St, Anytown, USA"  # Replace with actual parsing logic
                income = 50000  # Replace with actual parsing logic

                # Create a JSON response
                response_data = {
                    'name': name +"1",
                    'address': address,
                    'income': income,
                }

                return JsonResponse(response_data)
            else:
                # Form is not valid, return an error response
                errors = form.errors.as_json()
                return JsonResponse({'errors': errors}, status=400)
        
    except PdfReadError as error:
        return JsonResponse({'error': f'Invalid file format. Please upload a PDF file with {error}'}, status=400)
    except Exception as error:
        return JsonResponse({'error': f'Invalid request with error {error}'}, status=400)


class Profile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.User

    def get_object(self):
        return self.request.user


class Ping(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, *args, **kwargs):
        return response.Response({'now': timezone.now().isoformat()})


class UploadFile(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FileUploadSerializer

    def post(self, request, *args, **kwargs):
        print("printing request data",request.data)
        return extract_pdf_data(request)
        # return response.Response({'now': timezone.now().isoformat()})
    

# docker run -v images:/app/images -p 4001:4001 django-app